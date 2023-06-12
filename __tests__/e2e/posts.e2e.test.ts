import request from "supertest";
import {app} from "../../src";
import {HTTP_STATUS} from "../../src/utils/constants";
import mongoose from "mongoose";
import {mongoURI2} from "../../src/db/db";


describe('/posts', () => {
    beforeAll(async () => {
        await mongoose.connect(mongoURI2)
        await request(app).delete ('/testing/all-data')
    })

    it('1 - GET: /posts - return 200 and empty array', async () => {
        await request(app)
            .get('/posts')
            .expect(HTTP_STATUS.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })
    it('2 - GET: /posts - return 404 with not existing postId', async () => {
        await request(app)
            .get('/posts/1')
            .expect(HTTP_STATUS.NOT_FOUND_404)
    })



    afterAll(async () => {
        await mongoose.connection.close()
    })
})