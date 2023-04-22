import request from 'supertest'
import {app} from "../../src/app"
import {HTTP_STATUS} from "../../src/utils";

describe('/blogs', () => {
    beforeAll(async () => {
        await request(app).delete ('/testing/all-data')
    })

    it('should return 200 and empty array', async () => {
        await request(app)
            .get('/blogs')
            .expect(HTTP_STATUS.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    it('should return 404 for not existing blog', async () => {
        await request(app)
            .get('/blogs/1')
            .expect(HTTP_STATUS.NOT_FOUND_404)
    })

    // сначала делаем корректный POST без авторизации, чтобы БД осталась пустая
    it('shouldn\'t create blog with correct input - NO Auth', async () => {
        await request(app)
            .post('/blogs')
            .send({
                name: "valid name",
                description: "valid description",
                websiteUrl: 'https://valid-Url.com'
            })
            .expect(HTTP_STATUS.UNAUTHORIZED_401)
        await request(app)
            .get('/blogs')
            .expect(HTTP_STATUS.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    it('shouldn\'t create blog with incorrect input data (name = null)', async () => {
        await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                name: null,
                description: 'valid description',
                websiteUrl: 'https://valid-Url.com'
            })
            .expect(HTTP_STATUS.BAD_REQUEST_400, { 'errorsMessages': [{message: 'Invalid value', field: 'name'}] })
        await request(app)
            .get('/blogs')
            .expect(HTTP_STATUS.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    it('shouldn\'t create blog with correct input - (short description)', async () => {
        await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                name: "valid name",
                description: '<3',
                websiteUrl: 'https://valid-Url.com'
            })
            .expect(HTTP_STATUS.BAD_REQUEST_400, { 'errorsMessages': [{message: 'Invalid value', field: 'description'}] })
        await request(app)
            .get('/blogs')
            .expect(HTTP_STATUS.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })
})