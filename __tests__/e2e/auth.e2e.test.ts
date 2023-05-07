import request from "supertest";
import {app} from "../../src/app";
import {HTTP_STATUS} from "../../src/types/constants";


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
    it('3 – should return 401', async () => {
        await request(app)
            .post('/auth/login')
            .send({
                loginOrEmail: 'valid-unauthorized@mail.ru',
                password: 'qwerty1'
            })
            .expect(HTTP_STATUS.UNAUTHORIZED_401)
    })

    let createdUser1: any = null
    const password1 = 'qwerty1'
    it('4 – should create user by admin with correct input data & confirmed email', async () => {
        const createResponse = await request(app)
            .post('/users')
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                login: 'lg-111111',
                password: password1,
                email: 'valid1-email@mail.ru'
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

    it('5 – should return 400 if email already confirmed', async () => {
        await request(app)
            .post('/auth/registration-email-resending')
            .send({
                email: createdUser1.email
            })
            .expect(HTTP_STATUS.BAD_REQUEST_400)
    })

    it('6 – should return 400 if user\'s email already exist', async () => {
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
    it('7 – should return 400 if user\'s login already exist', async () => {
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

    it('8 – should return 204, create user & send confirmation email with code', async () => {
        await request(app)
            .post('/auth/registration')
            .send({
                login: 'valLog2',
                password: password1,
                email: 'artyomgolubev1@gmail.com'
            })
            .expect(HTTP_STATUS.NO_CONTENT_204)
    })

    it('9 – should return 400 if confirmation code doesnt exist', async () => {
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

    //todo как выводить процент покрытия тестов?
})