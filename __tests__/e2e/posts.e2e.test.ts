import request from "supertest";
import {app} from "../../src";
import {HTTP_STATUS} from "../../src/utils/constants";



describe('/posts', () => {
    beforeAll(async () => {
        await request(app).delete ('/testing/all-data')
    })

    it('should return 200 and empty array', async () => {
        await request(app)
            .get('/posts')
            .expect(HTTP_STATUS.OK_200, { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })

    it('should return 404 for not existing post', async () => {
        await request(app)
            .get('/posts/1')
            .expect(HTTP_STATUS.NOT_FOUND_404)
    })
})