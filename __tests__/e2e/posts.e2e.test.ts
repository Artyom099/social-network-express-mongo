import request from "supertest";
import {HTTP_STATUS, LikeStatus} from "../../src/utils/constants";
import mongoose from "mongoose";
import {mongoURI2} from "../../src/db/db";
import {getRefreshTokenByResponse, getRefreshTokenByResponseWithTokenName} from "../../src/utils/utils";
import {app} from "../../src";


describe('/posts', () => {
    beforeAll(async () => {
        await mongoose.connect(mongoURI2)
        await request(app).delete ('/testing/all-data')
    })

    it('1 – POST: /users – create 1st user by admin', async() => {
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
            .expect(HTTP_STATUS.OK_200, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [firstCreatedUser]
            })

        expect.setState({firstUser, firstCreateResponse, firstCreatedUser})
    });
    it('2 – POST: /users – create 2nd user by admin', async() => {
        const {firstCreatedUser} = expect.getState()
        const secondUser = {
            login: 'lg-222222',
            password: 'qwerty2',
            email: 'artyomgolubev2@gmail.com'
        }
        const secondCreateResponse = await request(app)
            .post('/users')
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                login: secondUser.login,
                password: secondUser.password,
                email: secondUser.email
            })
            .expect(HTTP_STATUS.CREATED_201)

        const secondCreatedUser = secondCreateResponse.body
        expect(secondCreatedUser).toEqual({
            id: expect.any(String),
            login: secondUser.login,
            email: secondUser.email,
            createdAt: expect.any(String),
        })

        await request(app)
            .get('/users')
            .auth('admin', 'qwerty', {type: 'basic'})
            .expect(HTTP_STATUS.OK_200, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 2,
                items: [firstCreatedUser, secondCreatedUser]
            })

        expect.setState({secondUser: secondUser, secondCreateResponse: secondCreateResponse})
    });
    it('2 – POST: /auth/login – return 200, 1st login and refreshToken', async() => {
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

        expect.setState({firstAccessToken: accessToken, firstRefreshToken: refreshToken, firstRefreshTokenWithName: refreshTokenWithName})
    });
    it('3 – POST: /blogs – return 201 & create blog', async() => {
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
    it('4 – POST: /posts – return 201 & create post', async() => {
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
        expect.setState({firstPost: createPostResponse.body})
    });

    it('5 - GET: /posts - return 200 and empty array', async() => {
        const {firstRefreshToken, firstPost, blogId} = expect.getState()
        const getPosts = await request(app)
            .get('/posts')
            .auth(firstRefreshToken, {type: 'bearer'})

        expect(getPosts).toBeDefined()
        expect(getPosts.status).toEqual(HTTP_STATUS.OK_200)
        expect(getPosts.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [
                {
                    id: firstPost.id,
                    title: firstPost.title,
                    shortDescription: firstPost.shortDescription,
                    content: firstPost.content,
                    blogId,
                    blogName: firstPost.blogName,
                    createdAt: firstPost.createdAt,
                    extendedLikesInfo: {
                        likesCount: 0,
                        dislikesCount: 0,
                        myStatus: firstPost.extendedLikesInfo.myStatus,
                        newestLikes: []
                    }
                }
            ]
        })
    })
    it('6 - GET: /posts - return 404 with not existing postId', async() => {
        const {firstRefreshToken} = expect.getState()
        await request(app)
            .get('/posts/1')
            .auth(firstRefreshToken, {type: 'bearer'})
            .expect(HTTP_STATUS.NOT_FOUND_404)
    })

    it('7 - PUT: /posts/:id/like-status - return 204 & set like', async() => {
        const {firstAccessToken, firstPost} = expect.getState()
        const setLike = await request(app)
            .put(`/posts/${firstPost.id}/like-status`)
            .auth(firstAccessToken, {type: 'bearer'})
            .send({likeStatus: LikeStatus.Like})

        expect(setLike).toBeDefined()
        expect(setLike.status).toEqual(HTTP_STATUS.NO_CONTENT_204)
    })
    it('8 – GET: /posts/:id – return 200 & get post with 1 like', async () => {
        const {firstAccessToken, firstPost} = expect.getState()
        const getPost = await request(app)
            .get(`/posts/${firstPost.id}`)
            .auth(firstAccessToken, {type: 'bearer'})

        expect(getPost).toBeDefined()
        expect(getPost.status).toEqual(HTTP_STATUS.OK_200)
        expect(getPost.body).toEqual({
            id: firstPost.id,
            title: firstPost.title,
            shortDescription: firstPost.shortDescription,
            content: firstPost.content,
            blogId: firstPost.blogId,
            blogName: firstPost.blogName,
            createdAt: firstPost.createdAt,
            extendedLikesInfo: {
                likesCount: 1,
                dislikesCount: 0,
                myStatus: LikeStatus.Like,
                newestLikes: [
                    {
                        addedAt: expect.any(String),
                        userId: expect.any(String),
                        login: expect.any(String)
                    }
                ]
            }
        })
    })
    it('9 - PUT: /posts/:id/like-status - return 204 & set dislike', async() => {
        const {firstAccessToken, firstPost} = expect.getState()
        const setLike = await request(app)
            .put(`/posts/${firstPost.id}/like-status`)
            .auth(firstAccessToken, {type: 'bearer'})
            .send({likeStatus: LikeStatus.Dislike})

        expect(setLike).toBeDefined()
        expect(setLike.status).toEqual(HTTP_STATUS.NO_CONTENT_204)
    })
    it('10 – GET: /posts/:id – return 200 & get post with 1 dislike', async () => {
        const {firstAccessToken, firstPost} = expect.getState()
        const getPost = await request(app)
            .get(`/posts/${firstPost.id}`)
            .auth(firstAccessToken, {type: 'bearer'})

        expect(getPost).toBeDefined()
        expect(getPost.status).toEqual(HTTP_STATUS.OK_200)
        expect(getPost.body).toEqual({
            id: firstPost.id,
            title: firstPost.title,
            shortDescription: firstPost.shortDescription,
            content: firstPost.content,
            blogId: firstPost.blogId,
            blogName: firstPost.blogName,
            createdAt: firstPost.createdAt,
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 1,
                myStatus: LikeStatus.Dislike,
                newestLikes: []
            }
        })
    })
    it('11 - PUT: /posts/:id/like-status - return 204 & delete dislike', async() => {
        const {firstAccessToken, firstPost} = expect.getState()
        const setLike = await request(app)
            .put(`/posts/${firstPost.id}/like-status`)
            .auth(firstAccessToken, {type: 'bearer'})
            .send({likeStatus: LikeStatus.None})

        expect(setLike).toBeDefined()
        expect(setLike.status).toEqual(HTTP_STATUS.NO_CONTENT_204)
    })
    it('12 – GET: /posts/:id – return 200 & get post', async () => {
        const {firstAccessToken, firstPost} = expect.getState()
        const getPost = await request(app)
            .get(`/posts/${firstPost.id}`)
            .auth(firstAccessToken, {type: 'bearer'})

        expect(getPost).toBeDefined()
        expect(getPost.status).toEqual(HTTP_STATUS.OK_200)
        expect(getPost.body).toEqual({
            id: firstPost.id,
            title: firstPost.title,
            shortDescription: firstPost.shortDescription,
            content: firstPost.content,
            blogId: firstPost.blogId,
            blogName: firstPost.blogName,
            createdAt: firstPost.createdAt,
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: LikeStatus.None,
                newestLikes: []
            }
        })
    })




    afterAll(async () => {
        await mongoose.connection.close()
    })
})