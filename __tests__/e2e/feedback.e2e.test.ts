import request from "supertest";
import {app} from "../../src";
import {HTTP_STATUS} from "../../src/utils/constants";
import {getRefreshTokenByResponse, getRefreshTokenByResponseWithTokenName} from "../../src/utils/utils";
import mongoose from "mongoose";
import {mongoURI2} from "../../src/db/db";


describe('/feedback', () => {
    beforeAll(async () => {
        await mongoose.connect(mongoURI2)
        await request(app).delete ('/testing/all-data')
    })

    it('1 – /users – create user by admin', async () => {
        const firstUser = {
            login: 'lg-111111',
            password: 'qwerty1',
            email: 'artyomgolubev1@gmail.com'
        }
        const firstCreateResponse = await request(app)
            .post('/users')
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                login: firstUser.login,
                password: firstUser.password,
                email: firstUser.email
            })
            .expect(HTTP_STATUS.CREATED_201)

        const firstCreatedUser = firstCreateResponse.body
        expect(firstCreatedUser).toEqual({
            id: expect.any(String),
            login: firstUser.login,
            email: firstUser.email,
            createdAt: expect.any(String),
        })

        await request(app)
            .get('/users')
            .auth('admin', 'qwerty', {type: 'basic'})
            .expect(HTTP_STATUS.OK_200, {pagesCount: 1, page: 1, pageSize: 10, totalCount: 1, items: [firstCreatedUser]})

        expect.setState({firstUser: firstUser, firstCreateResponse: firstCreateResponse})
    })
    it('2 – /auth/login – return 200, login and refreshToken', async () => {
        const {firstUser} = expect.getState()
        const loginResponse = await request(app)
            .post('/auth/login')
            .send({
                loginOrEmail: firstUser.login,
                password: firstUser.password
            })

        expect(loginResponse).toBeDefined()
        expect(loginResponse.status).toBe(HTTP_STATUS.OK_200)
        expect(loginResponse.body).toEqual({accessToken: expect.any(String)})
        const {accessToken} = loginResponse.body

        const refreshToken = getRefreshTokenByResponse(loginResponse)
        const refreshTokenWithName = getRefreshTokenByResponseWithTokenName(loginResponse)
        expect(refreshToken).toBeDefined()
        expect(refreshToken).toEqual(expect.any(String))

        expect.setState({accessToken, firstRefreshToken: refreshToken, firstRefreshTokenWithName: refreshTokenWithName})
    })
    it('3 – /blogs – return 201 & create blog', async () => {
        const createBlogResponse = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                name: 'valid-blog',
                description: 'valid-description',
                websiteUrl: 'valid-websiteUrl.com'
            })
        expect(createBlogResponse).toBeDefined()
        expect(createBlogResponse.status).toEqual(HTTP_STATUS.CREATED_201)
        expect.setState({blogId: createBlogResponse.body.id})
    });
    it('4 – /posts – return 201 & create post', async () => {
        const {blogId} = expect.getState()
        const createPostResponse = await request(app)
            .post('/posts')
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                title: 'valid-title',
                shortDescription: 'valid-shortDescription',
                content: 'valid-content',
                blogId
            })
        expect(createPostResponse).toBeDefined()
        expect(createPostResponse.status).toEqual(HTTP_STATUS.CREATED_201)
        expect.setState({postId: createPostResponse.body.id})
    });
    it('5 – /posts/:postId/comments – return 201 & create comment', async () => {
        const {postId, firstRefreshToken, firstUser} = expect.getState()
        const createCommentResponse = await request(app)
            .post(`/posts/${postId}/comments`)
            .auth(firstRefreshToken, {type: 'bearer'})
            .send({content: 'valid-super-long-content'})

        expect(createCommentResponse).toBeDefined()
        expect(createCommentResponse.status).toEqual(HTTP_STATUS.CREATED_201)
        expect(createCommentResponse.body).toEqual({
            id: expect.any(String),
            content: 'valid-super-long-content',
            commentatorInfo: {
                userId: expect.any(String),
                userLogin: firstUser.login
            },
            createdAt: expect.any(String),
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None'
            }
        })
        // console.log({commentId: createCommentResponse.body.id})
        expect.setState({commentId: createCommentResponse.body.id})
    });

    it('6 – /comments/:commentId/likes-status – return 404 – non exist comment', async () => {
        const {firstRefreshTokenWithName} = expect.getState()
        const setLike = await request(app)
            .put(`/comments/${123}/likes-status`)
            .set('cookie', firstRefreshTokenWithName)
            .send({likeStatus: 'Like'})

        expect(setLike).toBeDefined()
        expect(setLike.status).toEqual(HTTP_STATUS.NOT_FOUND_404)
    });
    it('7 – /comments/:id – return 200 & found comment', async () => {
        const {commentId} = expect.getState()
        const getComment = await request(app)
            .get(`/comments/${commentId}`)

        // console.log({commentId: commentId})
        expect(getComment).toBeDefined()
        expect(getComment.status).toEqual(HTTP_STATUS.OK_200)
    });

    it('8 – /comments/:commentId/likes-status – return 204 & set like', async () => {
        const {commentId, firstRefreshTokenWithName} = expect.getState()
        const setLike = await request(app)
            .put(`/comments/${commentId}/likes-status`)
            .set('cookie', firstRefreshTokenWithName)
            .send({likeStatus: 'Like'})

        console.log({commentIdT: commentId})
        expect(setLike).toBeDefined()
        expect(setLike.status).toEqual(HTTP_STATUS.NO_CONTENT_204)
    });


    afterAll(async () => {
        await mongoose.connection.close()
    })
})