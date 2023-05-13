import request from "supertest";
import {app} from "../../src/app";
import {HTTP_STATUS} from "../../src/types/constants";

const sleep = (seconds: number) => new Promise((r) => setTimeout(r, seconds * 1000))

describe('/auth', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })

    it('1 – should return 401', async () => {
        await request(app)
            .get('/auth/me')
            .expect(HTTP_STATUS.UNAUTHORIZED_401)
    })
    it('2 – should return 401', async () => {
        await request(app)
            .post('/auth/login')
            .send({
                loginOrEmail: 'valid-unauthorized@mail.ru',
                password: 'qwerty1'
            })
            .expect(HTTP_STATUS.UNAUTHORIZED_401)
    })

    let createdUser1: any = null
    let createResponse1: any = null
    let accessToken1: string = ''
    const password1 = 'qwerty1'
    it('3 – should create user by admin with correct input data & confirmed email', async () => {
        createResponse1 = await request(app)
            .post('/users')
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                login: 'lg-111111',
                password: password1,
                email: 'valid1-email@mail.ru'
            })
            .expect(HTTP_STATUS.CREATED_201)

        createdUser1 = createResponse1.body
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
    })
    it('4 - should return created user', async () => {
        //чтобы .split не ругался на возможный undefined
        if (!createResponse1.headers.authorization) return new Error()
        accessToken1 = createResponse1.headers.authorization.split(' ')[1]
        await request(app)
            .get('/auth/me')
            .auth('accessToken', {type: 'bearer'})
            .expect(HTTP_STATUS.OK_200, {
                email: createdUser1.email,
                login: createdUser1.login,
                userId: createdUser1.userId
            })
    })

    it('5 – should return 400 if email doesn\'t exist', async () => {
        await request(app)
            .post('/auth/registration-email-resending')
            .send({
                email: 'unknown-email@mail.com'
            })
            .expect(HTTP_STATUS.BAD_REQUEST_400)
    })
    it('6 – should return 400 if email already confirmed', async () => {
        await request(app)
            .post('/auth/registration-email-resending')
            .send({
                email: createdUser1.email
            })
            .expect(HTTP_STATUS.BAD_REQUEST_400)
    })

    it('7 – should return 400 if user\'s email already exist', async () => {
        await request(app)
            .post('/auth/registration')
            .send({
                login: 'otherLogin',
                password: password1,
                email: createdUser1.email
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
    it('8 – should return 400 if user\'s login already exist', async () => {
        await request(app)
            .post('/auth/registration')
            .send({
                login: createdUser1.login,
                password: password1,
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

    it('9 – should return 204, create user & send confirmation email with code', async () => {
        await request(app)
            .post('/auth/registration')
            .send({
                login: 'valLog2',
                password: password1,
                email: 'artyomgolubev1@gmail.com'
            })
            .expect(HTTP_STATUS.NO_CONTENT_204)
    })
    it('10 – should return 204 if user exist & send confirmation email with code', async () => {
        await request(app)
            .post('/auth/registration-email-resending')
            .send({
                email: 'artyomgolubev1@gmail.com'
            })
            .expect(HTTP_STATUS.NO_CONTENT_204)
    })

    it('11 – should return 400 if confirmation code doesn\'t exist', async () => {
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

    it('12 - should return 401', async () => {
        await request(app)
            .post('/auth/refresh-token')
            .send('noToken')
            .expect(HTTP_STATUS.UNAUTHORIZED_401)
    })

    it('13 - should return 200 and login', async () => {
        const loginResponse = await request(app)
            .post('/auth/login')
            .send({
                loginOrEmail: createdUser1.login,
                password: password1
            })

        expect(loginResponse).toBeDefined()
        expect(loginResponse.status).toBe(HTTP_STATUS.OK_200)
        expect(loginResponse.body).toEqual({accessToken: expect.any(String)})
        const {accessToken} = loginResponse.body

        const refreshToken = loginResponse.headers['set-cookie'][0].split(';')[0]
        expect(refreshToken).toBeDefined()
        expect(refreshToken).toEqual(expect.any(String))

        expect.setState({accessToken, firstRefreshToken: refreshToken})
    })

    it('14 - should return 200, refreshToken & accessToken', async () => {
        const {accessToken, firstRefreshToken} = expect.getState()
        await sleep(1.1)

        const goodRefreshTokenResponse = await request(app)
            .post('/auth/refresh-token')
            .set('Cookie', firstRefreshToken)

        expect(goodRefreshTokenResponse).toBeDefined()
        expect(goodRefreshTokenResponse.status).toBe(HTTP_STATUS.OK_200)
        expect(goodRefreshTokenResponse.body).toEqual({accessToken: expect.any(String)})

        const newAccessToken = goodRefreshTokenResponse.body.accessToken
        expect(newAccessToken).not.toBe(accessToken)

        const newRefreshToken = goodRefreshTokenResponse.headers['set-cookie'][0].split(';')[0]
        expect(newRefreshToken).toBeDefined()
        expect(newRefreshToken).toEqual(expect.any(String))
        expect(newRefreshToken).not.toBe(firstRefreshToken)

        expect.setState({accessToken: newAccessToken, refreshToken: newRefreshToken})
    })

    it('15 - should return 200, refreshToken & accessToken', async () => {
        const goodRefreshTokenResponse = await request(app)
            .post('/auth/refresh-token')

        expect(goodRefreshTokenResponse).toBeDefined()
        expect(goodRefreshTokenResponse.status).toBe(HTTP_STATUS.UNAUTHORIZED_401)
    })

    it('16 - should return 401 because old token in black list', async () => {
        const {firstRefreshToken} = expect.getState()
        await sleep(1.1)

        const goodRefreshTokenResponse = await request(app)
            .post('/auth/refresh-token')
            .set('Cookie', firstRefreshToken)

        expect(goodRefreshTokenResponse).toBeDefined()
        expect(goodRefreshTokenResponse.status).toBe(HTTP_STATUS.UNAUTHORIZED_401)
    })
})