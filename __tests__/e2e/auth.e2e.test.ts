import request from "supertest";
import {app} from "../../src/app";
import {HTTP_STATUS} from "../../src/types/constants";

const sleep = (seconds: number) => new Promise((r) => setTimeout(r, seconds * 1000))

const getRefreshTokenByResponse = (response: { headers: { [x: string]: string[]; }; }) => {
    return response.headers['set-cookie'][0].split(';')[0]
}

describe('/auth', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })

    it('1 – return 401', async () => {
        await request(app)
            .get('/auth/me')
            .expect(HTTP_STATUS.UNAUTHORIZED_401)
    })
    it('2 – return 401', async () => {
        await request(app)
            .post('/auth/login')
            .send({
                loginOrEmail: 'valid-unauthorized@mail.ru',
                password: 'qwerty1'
            })
            .expect(HTTP_STATUS.UNAUTHORIZED_401)
    })

    it('3 – create user by admin with correct input data & confirmed email', async () => {
        const firstPassword = 'qwerty1'
        const createResponse1 = await request(app)
            .post('/users')
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                login: 'lg-111111',
                password: firstPassword,
                email: 'artyomgolubev1@gmail.com'
            })
            .expect(HTTP_STATUS.CREATED_201)

        const createdUser1 = createResponse1.body
        expect(createdUser1).toEqual({
            id: expect.any(String),
            login: createdUser1.login,
            email: createdUser1.email,
            createdAt: expect.any(String),
        })

        await request(app)
            .get('/users')
            .auth('admin', 'qwerty', {type: 'basic'})
            .expect(HTTP_STATUS.OK_200, {pagesCount: 1, page: 1, pageSize: 10, totalCount: 1, items: [createdUser1]})

        expect.setState({firstUser: createdUser1, firstResponse: createResponse1, firstPassword})
    })
    it('4 - return created user', async () => {
        const {firstUser, firstResponse} = expect.getState()
        //чтобы .split не ругался на возможный undefined
        if (!firstResponse.headers.authorization) return new Error()
        const accessToken = getRefreshTokenByResponse(firstResponse)
        await request(app)
            .get('/auth/me')
            .auth('accessToken', {type: 'bearer'})
            .expect(HTTP_STATUS.OK_200, {
                email: firstUser.email,
                login: firstUser.login,
                userId: firstUser.userId
            })

        expect.setState({firstAccessToken: accessToken})
    })

    it('5 – return 400 if email doesn\'t exist', async () => {
        await request(app)
            .post('/auth/registration-email-resending')
            .send({email: 'unknown-email@mail.com'})
            .expect(HTTP_STATUS.BAD_REQUEST_400)
    })
    it('6 – return 400 if email already confirmed', async () => {
        const {firstUser} = expect.getState()
        await request(app)
            .post('/auth/registration-email-resending')
            .send({email: firstUser.email})
            .expect(HTTP_STATUS.BAD_REQUEST_400)
    })

    it('7 – return 400 if user\'s email already exist', async () => {
        const {firstUser, firstPassword} = expect.getState()
        await request(app)
            .post('/auth/registration')
            .send({
                login: 'otherLogin',
                password: firstPassword,
                email: firstUser.email
            })
            .expect(HTTP_STATUS.BAD_REQUEST_400, {
                errorsMessages: [
                    {
                        message: 'user with the given email already exists',
                        field: 'email'
                    }
                ]
            })
    })
    it('8 – return 400 if user\'s login already exist', async () => {
        const {firstUser, firstPassword} = expect.getState()
        await request(app)
            .post('/auth/registration')
            .send({
                login: firstUser.login,
                password: firstPassword,
                email: 'other-email@mail.com'
            })
            .expect(HTTP_STATUS.BAD_REQUEST_400, {
                errorsMessages: [
                    {
                        message: 'user with the given login already exists',
                        field: 'login'
                    }
                ]
            })
    })

    it('9 – return 204, create user & send confirmation email with code', async () => {
        const {firstPassword} = expect.getState()
        await request(app)
            .post('/auth/registration')
            .send({
                login: 'valLog2',
                password: firstPassword,
                email: 'artgolubev@bk.ru'
            })
            .expect(HTTP_STATUS.NO_CONTENT_204)
    })
    it('10 – return 204 if user exist & send confirmation email with code', async () => {
        await request(app)
            .post('/auth/registration-email-resending')
            .send({
                email: 'artgolubev@bk.ru'
            })
            .expect(HTTP_STATUS.NO_CONTENT_204)
    })

    it('11 – return 400 if confirmation code doesn\'t exist', async () => {
        await request(app)
            .post('/auth/registration-confirmation')
            .send({
                code: 'invalid code',
            })
            .expect(HTTP_STATUS.BAD_REQUEST_400, {
                errorsMessages: [
                    {
                        message: 'code is incorrect, expired or already been applied',
                        field: 'code'
                    }
                ]
            })
    })

    it('12 - return 401', async () => {
        await request(app)
            .post('/auth/refresh-token')
            .send('noToken')
            .expect(HTTP_STATUS.UNAUTHORIZED_401)
    })

    it('13 - return 200 and login', async () => {
        const {firstUser, firstPassword} = expect.getState()
        const loginResponse = await request(app)
            .post('/auth/login')
            .send({
                loginOrEmail: firstUser.login,
                password: firstPassword
            })

        expect(loginResponse).toBeDefined()
        expect(loginResponse.status).toBe(HTTP_STATUS.OK_200)
        expect(loginResponse.body).toEqual({accessToken: expect.any(String)})
        const {accessToken} = loginResponse.body

        const refreshToken = getRefreshTokenByResponse(loginResponse)
        expect(refreshToken).toBeDefined()
        expect(refreshToken).toEqual(expect.any(String))

        expect.setState({accessToken, firstRefreshToken: refreshToken})
    })

    it('14 - return 200, newRefreshToken & newAccessToken', async () => {
        const {accessToken, firstRefreshToken} = expect.getState()
        await sleep(1.1)

        const goodRefreshTokenResponse = await request(app)
            .post('/auth/refresh-token')
            .set('cookie', firstRefreshToken)

        expect(goodRefreshTokenResponse).toBeDefined()
        expect(goodRefreshTokenResponse.status).toBe(HTTP_STATUS.OK_200)
        expect(goodRefreshTokenResponse.body).toEqual({accessToken: expect.any(String)})

        const newAccessToken = goodRefreshTokenResponse.body.accessToken
        expect(newAccessToken).not.toBe(accessToken)

        const newRefreshToken = getRefreshTokenByResponse(goodRefreshTokenResponse)
        expect(newRefreshToken).toBeDefined()
        expect(newRefreshToken).toEqual(expect.any(String))
        expect(newRefreshToken).not.toBe(firstRefreshToken)

        expect.setState({secondAccessToken: newAccessToken, secondRefreshToken: newRefreshToken})
    })

    it('15 - return 401 with no any token', async () => {
        const goodRefreshTokenResponse = await request(app)
            .post('/auth/refresh-token')

        expect(goodRefreshTokenResponse).toBeDefined()
        expect(goodRefreshTokenResponse.status).toBe(HTTP_STATUS.UNAUTHORIZED_401)
    })
    it('16 - return 401 because old token in black list', async () => {
        const {firstRefreshToken} = expect.getState()
        await sleep(1.1)

        const goodRefreshTokenResponse = await request(app)
            .post('/auth/refresh-token')
            .set('cookie', firstRefreshToken)

        expect(goodRefreshTokenResponse).toBeDefined()
        expect(goodRefreshTokenResponse.status).toBe(HTTP_STATUS.UNAUTHORIZED_401)
    })

    it('17 - return 400 with no email in body', async () => {
        const {secondRefreshToken} = expect.getState()
        const recoveryResponse = await request(app)
            .post('/auth/password-recovery')
            .set('cookie', secondRefreshToken)

        expect(recoveryResponse).toBeDefined()
        expect(recoveryResponse.status).toBe(HTTP_STATUS.BAD_REQUEST_400)
    })
    it('18 - return 204 & send recovery code to email', async () => {
        const {firstUser, secondRefreshToken} = expect.getState()
        const recoveryResponse = await request(app)
            .post('/auth/password-recovery')
            .set('cookie', secondRefreshToken)
            .send({email: firstUser.email})

        expect(recoveryResponse).toBeDefined()
        expect(recoveryResponse.status).toBe(HTTP_STATUS.NO_CONTENT_204)
    })

    it('19 - return 429 - \'/auth/password-recovery\'', async () => {
        const {firstUser} = expect.getState()
        await sleep(10)

        await request(app)
            .post('/auth/password-recovery')
            .set('user-agent', 'device-2')
            .send({email: firstUser.email})
            .expect(HTTP_STATUS.NO_CONTENT_204)

        await request(app)
            .post('/auth/password-recovery')
            .set('user-agent', 'device-3')
            .send({email: firstUser.email})
            .expect(HTTP_STATUS.NO_CONTENT_204)

        await request(app)
            .post('/auth/password-recovery')
            .set('user-agent', 'device-4')
            .send({email: firstUser.email})
            .expect(HTTP_STATUS.NO_CONTENT_204)

        await request(app)
            .post('/auth/password-recovery')
            .set('user-agent', 'device-5')
            .send({email: firstUser.email})
            .expect(HTTP_STATUS.NO_CONTENT_204)

        await request(app)
            .post('/auth/password-recovery')
            .set('user-agent', 'device-6')
            .send({email: firstUser.email})
            .expect(HTTP_STATUS.NO_CONTENT_204)

        const loginResponse = await request(app)
            .post('/auth/password-recovery')
            .set('user-agent', 'device-7')
            .send({email: firstUser.email})
            .expect(HTTP_STATUS.TOO_MANY_REQUESTS_429)

        expect(loginResponse).toBeDefined()
    })


    it('20 - return 204 & logout', async () => {
        const {secondRefreshToken} = expect.getState()
        const goodRefreshTokenResponse = await request(app)
            .post('/auth/logout')
            .set('cookie', secondRefreshToken)

        expect(goodRefreshTokenResponse).toBeDefined()
        expect(goodRefreshTokenResponse.status).toBe(HTTP_STATUS.NO_CONTENT_204)
    })
})