import request from "supertest";
import {app} from "../../src/app";
import {HTTP_STATUS} from "../../src/types/constants";


describe('/security', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })

    it('1 – should create user by admin with correct input data & confirmed email', async () => {
        const password1 = 'qwerty1'
        const createResponse1 = await request(app)
            .post('/users')
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                login: 'lg-111111',
                password: password1,
                email: 'valid1-email@mail.ru'
            })

        expect(createResponse1.status).toBe(HTTP_STATUS.CREATED_201)
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

        expect.setState({createdUser1, password1})
    })

    it('2 - should return 200 and login', async () => {
        const {createdUser1, password1} = expect.getState()

        const loginResponse = await request(app)
            .post('/auth/login')
            // .set(header('user-agent', 'device-1'))
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

})