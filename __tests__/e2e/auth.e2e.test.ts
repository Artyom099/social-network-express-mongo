import request from "supertest";
import {app} from "../../src/app";
import {HTTP_STATUS} from "../../src/utils";


describe('/auth', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })

    it('should return 401', async () => {
        await request(app)
            .get('/auth/me')
            .expect(HTTP_STATUS.UNAUTHORIZED_401)
    })

    it('should return 401', async () => {
        await request(app)
            .post('/auth/login')
            .send({
                loginOrEmail: 'valid-unauthorized@mail.ru',
                password: 'qwerty1'
            })
            .expect(HTTP_STATUS.UNAUTHORIZED_401)
    })

    it('should return 401', async () => {
        await request(app)
            .post('/auth/login')
            .send({
                loginOrEmail: 'valid-unauthorized@mail.ru',
                password: 'qwerty1'
            })
            .expect(HTTP_STATUS.UNAUTHORIZED_401)
    })

    it('should return 204 and create user', async () => {
        const createResponse = await request(app)
            .post('/auth/registration')
            .send({
                login: 'valid-super-login',
                password: 'qwerty1',
                email: 'valid-super@mail.ru'
            })
            .expect(HTTP_STATUS.NO_CONTENT_204)

        //todo залезать в бд и оттуда брать код, либо как-то с помщью nodemailer
    })
})