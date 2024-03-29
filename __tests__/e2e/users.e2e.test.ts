import request from "supertest";
import {HTTP_STATUS} from "../../src/infrastructure/utils/enums";
import {app} from "../../src/main";


describe('/users', () => {
    beforeAll(async () => {
        await request(app).delete ('/testing/all-data')
    })

    it('1 - should return 200 and empty array', async () => {
        await request(app)
            .get('/users')
            .auth('admin', 'qwerty', {type: 'basic'})
            .expect(HTTP_STATUS.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    let createdUser1: any = null
    const password1 = 'qwerty1'
    it('2 - should create user with correct input data', async () => {
        const createResponse = await request(app)
            .post('/users')
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                login: 'lg-647449',
                password: password1,
                email: 'valid-email@mail.ru'
            })
            .expect(HTTP_STATUS.CREATED_201)

        createdUser1 = createResponse.body
        expect(createdUser1).toEqual({
            id: expect.any(String),
            login: createdUser1.login,
            email: createdUser1.email,
            createdAt: expect.any(String),
        })

        await request(app)
            .get('/users')
            .auth('admin', 'qwerty', {type: 'basic'})
            .expect(HTTP_STATUS.OK_200, { pagesCount: 1, page: 1, pageSize: 10, totalCount: 1, items: [createdUser1] })
    })

    let token: string = ''
    it('3 - should login to system with correct input data', async () => {
        const createResponse = await request(app)
            .post('/auth/login')
            .send({
                loginOrEmail: createdUser1.login,
                password: password1,
            })
            .expect(HTTP_STATUS.OK_200)

        //чтобы .split не ругался на возможный undefined
        if (!createResponse.headers.authorization) return new Error()
        token = createResponse.headers.authorization.split(' ')[1]
        await request(app)
            .get('/auth/me')
            .auth('token', {type: 'bearer'})
            .expect(HTTP_STATUS.OK_200, {
                email: createdUser1.email,
                login: createdUser1.login,
                userId: createdUser1.userId
            })
    })
})