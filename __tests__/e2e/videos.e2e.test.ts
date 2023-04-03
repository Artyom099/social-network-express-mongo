import request from 'supertest'
import {app} from "../../src";

describe('/videos', () => {

    it('should return 200 and empty array', async () => {
        await request(app)
            .get('/videos')
            .expect(200, [])
    })

})