import request from "supertest";
import {app} from "../../src/app";
import {HTTP_STATUS} from "../../src/types/constants";


describe('/security', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })

    it('1 – create user by admin with correct input data & confirmed email', async () => {
        const password1 = 'qwerty1'
        const createResponse = await request(app)
            .post('/users')
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                login: 'lg-111111',
                password: password1,
                email: 'valid1-email@mail.ru'
            })

        expect(createResponse.status).toBe(HTTP_STATUS.CREATED_201)
        const createdUser1 = createResponse.body
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

        expect.setState({createdUser1, password1})
    })

    it('2 - return 200 and login 1st user - 1st device', async () => {
        const {createdUser1, password1} = expect.getState()

        const loginResponse = await request(app)
            .post('/auth/login')
            .set('user-agent', 'device-1')
            .send({
                loginOrEmail: createdUser1.login,
                password: password1
            })

        expect(loginResponse).toBeDefined()
        expect(loginResponse.status).toBe(HTTP_STATUS.OK_200)
        // console.log(loginResponse.headers)   //todo - почему в headers нет 'user-agent'?
        // expect(loginResponse.headers['user-agent']).toEqual('device-1')
        const {accessToken} = loginResponse.body
        expect(loginResponse.body).toEqual({accessToken: expect.any(String)})


        const refreshToken = loginResponse.headers['set-cookie'][0].split(';')[0]
        expect(refreshToken).toBeDefined()
        expect(refreshToken).toEqual(expect.any(String))

        expect.setState({firstAccessToken: accessToken, firstRefreshToken: refreshToken})
    })
    it('3 - return 200 and login 1st user - 2nd device', async () => {
        const {createdUser1, password1} = expect.getState()

        const loginResponse = await request(app)
            .post('/auth/login')
            .set('user-agent', 'device-2')
            .send({
                loginOrEmail: createdUser1.login,
                password: password1
            })

        expect(loginResponse).toBeDefined()
        expect(loginResponse.status).toBe(HTTP_STATUS.OK_200)
        // expect(loginResponse.headers['user-agent']).toEqual('device-2')
        expect(loginResponse.body).toEqual({accessToken: expect.any(String)})
        const {accessToken} = loginResponse.body

        const refreshToken = loginResponse.headers['set-cookie'][0].split(';')[0]
        expect(refreshToken).toBeDefined()
        expect(refreshToken).toEqual(expect.any(String))

        expect.setState({secondAccessToken: accessToken, secondRefreshToken: refreshToken})
    })
    it('4 - return 200 and login 1st user - 3rd device', async () => {
        const {createdUser1, password1} = expect.getState()

        const loginResponse = await request(app)
            .post('/auth/login')
            .set('user-agent', 'device-3')
            .send({
                loginOrEmail: createdUser1.login,
                password: password1
            })

        expect(loginResponse).toBeDefined()
        expect(loginResponse.status).toBe(HTTP_STATUS.OK_200)
        // expect(loginResponse.headers['user-agent']).toEqual('device-3')
        expect(loginResponse.body).toEqual({accessToken: expect.any(String)})
        const {accessToken} = loginResponse.body

        const refreshToken = loginResponse.headers['set-cookie'][0].split(';')[0]
        expect(refreshToken).toBeDefined()
        expect(refreshToken).toEqual(expect.any(String))

        expect.setState({thirdAccessToken: accessToken, thirdRefreshToken: refreshToken})
    })
    it('5 - return 200 and login 1st user - 4th device', async () => {
        const {createdUser1, password1} = expect.getState()

        const loginResponse = await request(app)
            .post('/auth/login')
            .set('user-agent', 'device-4')
            .send({
                loginOrEmail: createdUser1.login,
                password: password1
            })

        expect(loginResponse).toBeDefined()
        expect(loginResponse.status).toBe(HTTP_STATUS.OK_200)
        // expect(loginResponse.headers['user-agent']).toEqual('device-4')
        expect(loginResponse.body).toEqual({accessToken: expect.any(String)})
        const {accessToken} = loginResponse.body

        const refreshToken = loginResponse.headers['set-cookie'][0].split(';')[0]
        expect(refreshToken).toBeDefined()
        expect(refreshToken).toEqual(expect.any(String))

        expect.setState({thirdAccessToken: accessToken, thirdRefreshToken: refreshToken})
    })

    it('6 - return all login devices 1st user', async () => {
        const {firstRefreshToken} = expect.getState()
        const getResponse = await request(app)
            .get('/security/devices')
            .set('cookie', firstRefreshToken)

        expect(getResponse).toBeDefined()
        expect(getResponse.status).toBe(HTTP_STATUS.OK_200)
        expect(getResponse.body[0].deviceId).toEqual(expect.any(String))

        expect.setState({firstDeviceIdFirstUser: getResponse.body[0].deviceId})
        console.log('devices 1 - ', getResponse.body)
    })

    it('7 - return 404 if try to delete non-existent device', async () => {
        const {firstRefreshToken} = expect.getState()
        const deleteResponse = await request(app)
            .delete('/security/devices/1')
            .set('cookie', firstRefreshToken)

        expect(deleteResponse).toBeDefined()
        expect(deleteResponse.status).toBe(HTTP_STATUS.NOT_FOUND_404)
    })
    it('8 - return 401 with no token', async () => {
        const getNoTokenResponse = await request(app)
            .get('/security/devices')
            .set('cookie', 'noToken')

        expect(getNoTokenResponse).toBeDefined()
        expect(getNoTokenResponse.status).toBe(HTTP_STATUS.UNAUTHORIZED_401)

        const deleteNoTokenResponse = await request(app)
            .delete('/security/devices')
            .set('cookie', 'noToken')

        expect(deleteNoTokenResponse).toBeDefined()
        expect(deleteNoTokenResponse.status).toBe(HTTP_STATUS.UNAUTHORIZED_401)

        const deleteByDeviceIdNoTokenResponse = await request(app)
            .delete('/security/devices')
            .set('cookie', 'noToken')

        expect(deleteByDeviceIdNoTokenResponse).toBeDefined()
        expect(deleteByDeviceIdNoTokenResponse.status).toBe(HTTP_STATUS.UNAUTHORIZED_401)
    })
    it('9 - return 403 if try to delete the deviceId 2nd user of 1st user', async () => {
        // create 2nd user
        const password = 'qwerty2'
        const createResponse = await request(app)
            .post('/users')
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                login: 'lg-222222',
                password: password,
                email: 'valid2-email@mail.ru'
            })

        // login 2nd user
        const loginResponse = await request(app)
            .post('/auth/login')
            .set('user-agent', 'device-1')
            .send({
                loginOrEmail: createResponse.body.login,
                password: password
            })

        // try to delete 1st user's devise by 2nd user
        const {firstDeviceIdFirstUser, firstRefreshToken} = expect.getState()
        const deleteResponse = await request(app)
            .delete(`/security/devices/${firstDeviceIdFirstUser}`)
            .set('cookie', firstRefreshToken)

        // console.log(firstDeviceIdFirstUser)
        expect(loginResponse).toBeDefined()
        expect(loginResponse.status).toBe(HTTP_STATUS.OK_200)
        expect(deleteResponse).toBeDefined()
        expect(deleteResponse.status).toBe(HTTP_STATUS.FORBIDDEN_403)
    })

    it('10 - return 200, newRefreshToken & newAccessToken', async () => {
        const {firstRefreshToken} = expect.getState()
        const goodRefreshTokenResponse = await request(app)
            .post('/auth/refresh-token')
            .set('cookie', firstRefreshToken)

        expect(goodRefreshTokenResponse).toBeDefined()
        expect(goodRefreshTokenResponse.status).toBe(HTTP_STATUS.OK_200)
        expect(goodRefreshTokenResponse.body).toEqual({accessToken: expect.any(String)})

        const newFirstRefreshToken = goodRefreshTokenResponse.headers['set-cookie'][0].split(';')[0]
        expect(newFirstRefreshToken).toBeDefined()
        expect(newFirstRefreshToken).toEqual(expect.any(String))
        expect(newFirstRefreshToken).not.toBe(firstRefreshToken)
        expect.setState({newFirstRefreshToken})
    })
    it('11 - return all login devices 1st user - other lastActiveDate 1st device', async () => {
        const {newFirstRefreshToken} = expect.getState()
        const getResponse = await request(app)
            .get('/security/devices')
            .set('cookie', newFirstRefreshToken)

        expect(getResponse).toBeDefined()
        expect(getResponse.status).toBe(HTTP_STATUS.OK_200)
        expect(getResponse.body[0].deviceId).toEqual(expect.any(String))

        expect.setState({firstDeviceIdFirstUser: getResponse.body[0].deviceId})
        console.log('devices 2 - ', getResponse.body)
    })
})