import request from "supertest";
import {app} from "../../src";


describe('/feedback', () => {
    beforeAll(async () => {
        await request(app).delete ('/testing/all-data')
    })

})