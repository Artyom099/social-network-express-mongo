import request from 'supertest'
import {app} from "../../src/app"

describe('/videos', () => {
    beforeAll(async () => {
        await request(app).delete ('/testing/all-data')
    })

    it('should return 200 and empty array', async () => {
        await request(app)
            .get('/videos')
            .expect(200, [])
    })

    it('should return 404 for not existing video', async () => {
        await request(app)
            .get('/videos/1')
            .expect(404)
    })

    // сначала делаем некорректный POST, чтобы БД осталась пустая
    it('shouldn\'t create video with incorrect input data', async () => {
        await request(app)
            .post('/videos')
            .send({
                title: null,
                author: "string",
                availableResolutions: ["P144", "P240", "P720"]
            })
            .expect(400)
        await request(app)
            .get('/videos')
            .expect(200, [])
    })

    // получается, что этот тест зависит от предыдущего, а это плохо!
    let createdVideo1: any = null
    it('should create video with correct input data', async () => {
        const createResponse = await request(app)
            .post('/videos')
            .send({
                title: "valid title",
                author: "valid author",
                availableResolutions: ["P144", "P240", "P720"]
            })
            .expect(201)

        createdVideo1 = createResponse.body
        expect(createdVideo1).toEqual({
            id: expect.any(Number),
            title: 'valid title',
            author: 'valid author',
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: expect.any(String),
            publicationDate: expect.any(String),
            availableResolutions: ["P144", "P240", "P720"]
        })

        await request(app)
            .get('/videos')
            .expect(200, [createdVideo1])
    })

    let createdVideo2: any = null
    it('create one more video with correct input data', async () => {
        const createResponse = await request(app)
            .post('/videos')
            .send({
                title: "valid title",
                author: "valid author",
                availableResolutions: ["P144", "P240", "P720"]
            })
            .expect(201)

        createdVideo2 = createResponse.body
        expect(createdVideo2).toEqual({
            id: expect.any(Number),
            title: 'valid title',
            author: 'valid author',
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: expect.any(String),
            publicationDate: expect.any(String),
            availableResolutions: ["P144", "P240", "P720"]
        })

        await request(app)
            .get('/videos')
            .expect(200, [createdVideo1, createdVideo2])
    })

    // TODO - не работет, починить
    // it('shouldn\'t update video with incorrect input data', async () => {
    //     await request(app)
    //         .put('/videos/' + createdVideo.id)
    //         .send({
    //             title: "valid title",
    //             author: "invalid author len=21",
    //             availableResolutions: ["P144", "P720"],
    //             canBeDownloaded: true,
    //             minAgeRestriction: 18,
    //             publicationDate: new Date().toISOString()
    //         })
    //         .expect(400)
    //
    //     expect(createdVideo).toEqual({
    //         message: expect.any(String),
    //         field: 'author'
    //     })
    //
    //     await request(app)
    //         .get('/videos/' + createdVideo.id)
    //         .expect(200, [createdVideo])
    // })

    it('shouldn\'t update video that not exist', async () => {
        await request(app)
            .put('/videos/' + -2)
            .send({
                title: "valid title",
                author: "valid author",
                availableResolutions: ["P144", "P720"],
                canBeDownloaded: true,
                minAgeRestriction: 18,
                publicationDate: new Date().toISOString()
            })
            .expect(404)
    })

    // TODO - не работет, починить
    // it('should update video with correct input data', async () => {
    //         await request(app)
    //             .put('/videos/' + createdVideo.id)
    //             .send({
    //                 title: 'UPDATED valid title',
    //                 author: "valid author",
    //                 availableResolutions: ["P144", "P240", "P720"],
    //                 canBeDownloaded: false,
    //                 minAgeRestriction: null,
    //                 publicationDate: new Date().toISOString()
    //             })
    //             .expect(204)
    //
    //         await request(app)
    //             .get('/videos/' + createdVideo.id)
    //             .expect(200, {
    //                 ...createdVideo,
    //                 title: 'UPDATED valid title',
    //                 publicationDate: expect.any(String)
    //             })
    //     })

    it('should delete both videos', async () => {
        await request(app)
            .delete('/videos/' + createdVideo1.id)
            .expect(204)

        await request(app)
            .get('/videos/' + createdVideo1.id)
            .expect(404)

        await request(app)
            .delete('/videos/' + createdVideo2.id)
            .expect(204)

        await request(app)
            .get('/videos/' + createdVideo2.id)
            .expect(404)

        await request(app)
            .get('/videos')
            .expect(200, [])
    })
})