import request from 'supertest'
import {app} from "../../src/app"

describe('/blogs', () => {
    beforeAll(async () => {
        await request(app).delete ('/testing/all-data')
    })

    it('should return 200 and empty array', async () => {
        await request(app)
            .get('/blogs')
            .expect(200, [])
    })
})