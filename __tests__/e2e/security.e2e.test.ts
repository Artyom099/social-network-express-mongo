import request from "supertest";
import {app} from "../../src/app";


describe('/security', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })


})