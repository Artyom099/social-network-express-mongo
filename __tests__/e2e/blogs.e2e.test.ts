import request from 'supertest'
import {app} from "../../src/app"
import {HTTP_STATUS} from "../../src/types/constants";
import mongoose from "mongoose";
import {mongoURI2} from "../../src/db/db";


describe('/blogs', () => {
    beforeAll(async () => {
        await mongoose.connect(mongoURI2)
        await request(app).delete ('/testing/all-data')
    })

    it('1 - return 200 and empty array', async () => {
        await request(app)
            .get('/blogs')
            .expect(HTTP_STATUS.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    it('2 - return 404 for not existing blog', async () => {
        await request(app)
            .get('/blogs/1')
            .expect(HTTP_STATUS.NOT_FOUND_404)
    })

    it('3 - shouldn\'t create blog with correct input - NO Auth', async () => {
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
    it('4 - shouldn\'t create blog with incorrect input data (name = null)', async () => {
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
    it('5 - shouldn\'t create blog with incorrect input data - (short description)', async () => {
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
    it('6 - shouldn\'t create blog with incorrect input data - (Invalid websiteUrl)', async () => {
        await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                name: "valid name",
                description: 'valid description',
                websiteUrl: 'Invalid-Url.c'
            })
            .expect(HTTP_STATUS.BAD_REQUEST_400, { 'errorsMessages': [{message: 'Invalid value', field: 'websiteUrl'}] })
        await request(app)
            .get('/blogs')
            .expect(HTTP_STATUS.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    it('7 - create blog with correct input data', async () => {
        const createResponse = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                name: "valid name",
                description: 'valid description',
                websiteUrl: 'https://valid-Url.com'
            })
            .expect(HTTP_STATUS.CREATED_201)

        const createdBlog1 = createResponse.body
        expect(createdBlog1).toEqual({
            id: expect.any(String),
            name: "valid name",
            description: 'valid description',
            websiteUrl: 'https://valid-Url.com',
            createdAt: expect.any(String),
            isMembership: false
        })


        await request(app)
            .get('/blogs')
            .expect(HTTP_STATUS.OK_200, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [createdBlog1]
            })

        expect.setState({createdBlog1: createdBlog1})
    })
    it('8 - create blog with correct input data', async () => {
        const {createdBlog1} = expect.getState()
        const createResponse = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                name: "valid name 2",
                description: 'valid description 2',
                websiteUrl: 'https://valid-Url2.com'
            })
            .expect(HTTP_STATUS.CREATED_201)

        const createdBlog2 = createResponse.body
        expect(createdBlog2).toEqual({
            id: expect.any(String),
            name: "valid name 2",
            description: 'valid description 2',
            websiteUrl: 'https://valid-Url2.com',
            createdAt: expect.any(String),
            isMembership: false
        })

        await request(app)
            .get('/blogs')
            .expect(HTTP_STATUS.OK_200, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 2,
                items: [createdBlog2, createdBlog1]
            })

        expect.setState({createdBlog2: createdBlog2})
    })

    it('9 - shouldn\'t update blog that not exist', async () => {
        await request(app)
            .put('/blogs/' + -3)
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                name: "val_name update",
                description: 'valid description update',
                websiteUrl: 'https://valid-Url-update.com'
            })
            .expect(HTTP_STATUS.NOT_FOUND_404)
    })
    it('10 - shouldn\'t update blog with incorrect input data', async () => {
        const {createdBlog1} = expect.getState()
        await request(app)
            .put('/blogs/' + createdBlog1.id)
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                name: "invalid long name update",
                description: 'valid description update',
                websiteUrl: 'https://valid-Url-update.com'
            })
            .expect(HTTP_STATUS.BAD_REQUEST_400)

        await request(app)
            .get('/blogs/' + createdBlog1.id)
            .expect(HTTP_STATUS.OK_200, createdBlog1)
    })

    it('11 - update blog with correct input data', async () => {
        const {createdBlog1} = expect.getState()
            await request(app)
                .put('/blogs/' + createdBlog1.id)
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    name: "val_name update",
                    description: 'valid description update',
                    websiteUrl: 'https://valid-Url-update.com'
                })
                .expect(HTTP_STATUS.NO_CONTENT_204)

            await request(app)
                .get('/blogs/' + createdBlog1.id)
                .expect(HTTP_STATUS.OK_200, {
                    ...createdBlog1,
                    name: "val_name update",
                    description: 'valid description update',
                    websiteUrl: 'https://valid-Url-update.com'
                })
        })

    it('12 - return 404 for delete non-exist blog', async () => {
        await request(app)
            .delete('/blogs/1')
            .auth('admin', 'qwerty', {type: 'basic'})
            .expect(HTTP_STATUS.NOT_FOUND_404)
    })

    it('13 - delete both blogs', async () => {
        const {createdBlog1, createdBlog2} = expect.getState()
        await request(app)
            .delete('/blogs/' + createdBlog1.id)
            .auth('admin', 'qwerty', {type: 'basic'})
            .expect(HTTP_STATUS.NO_CONTENT_204)

        await request(app)
            .get('/blogs/' + createdBlog1.id)
            .expect(HTTP_STATUS.NOT_FOUND_404)

        await request(app)
            .get('/blogs')
            .expect(HTTP_STATUS.OK_200, { pagesCount: 1, page: 1, pageSize: 10, totalCount: 1, items: [createdBlog2] })

        await request(app)
            .delete('/blogs/' + createdBlog2.id)
            .auth('admin', 'qwerty', {type: 'basic'})
            .expect(HTTP_STATUS.NO_CONTENT_204)

        await request(app)
            .get('/blogs/' + createdBlog2.id)
            .expect(HTTP_STATUS.NOT_FOUND_404)

        await request(app)
            .get('/blogs')
            .expect(HTTP_STATUS.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    afterAll(async () => {
        await mongoose.connection.close()
    })
})