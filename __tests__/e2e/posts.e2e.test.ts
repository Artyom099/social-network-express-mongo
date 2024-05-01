import request from "supertest";
import {HTTP_STATUS, LikeStatus} from "../../src/infrastructure/utils/enums";
import mongoose from "mongoose";
import {mongoURI2} from "../../src/infrastructure/db/db";
import {getRefreshTokenByResponse, getRefreshTokenByResponseWithTokenName} from "../../src/infrastructure/utils/handlers";
import {app} from "../../src/main";


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
    })
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
    })
    it('3 – POST: /users – create 3rd user by admin', async() => {
        const thirdUser = {
            login: 'lg-333333',
            password: 'qwerty3',
            email: 'artyomgolubev3@gmail.com'
        }
        await request(app)
            .post('/users')
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                login: thirdUser.login,
                password: thirdUser.password,
                email: thirdUser.email
            })
            .expect(HTTP_STATUS.CREATED_201)

        expect.setState({thirdUser: thirdUser})
    })
    it('4 – POST: /users – create 4th user by admin', async() => {
        const fourthUser = {
            login: 'lg-444444',
            password: 'qwerty4',
            email: 'artyomgolubev4@gmail.com'
        }
        await request(app)
            .post('/users')
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                login: fourthUser.login,
                password: fourthUser.password,
                email: fourthUser.email
            })
            .expect(HTTP_STATUS.CREATED_201)

        expect.setState({fourthUser: fourthUser})
    })
    it('5 – POST: /users – create 5th user by admin', async() => {
        const fifthUser = {
            login: 'lg-555555',
            password: 'qwerty5',
            email: 'artyomgolubev5@gmail.com'
        }
        await request(app)
            .post('/users')
            .auth('admin', 'qwerty', {type: 'basic'})
            .send({
                login: fifthUser.login,
                password: fifthUser.password,
                email: fifthUser.email
            })
            .expect(HTTP_STATUS.CREATED_201)

        expect.setState({fifthUser: fifthUser})
    })

    it('6 – POST: /auth/login – return 200, 1st user login and refreshToken', async() => {
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
    })
    it('7 – POST: /blogs – return 201 & create blog by 1st user', async() => {
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
    })
    it('8 – POST: /posts – return 201 & create post by 1st user', async() => {
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
    })

    it('9 – GET: /posts – return 200 and empty array', async() => {
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
    it('10 – GET: /posts – return 404 with not existing postId', async() => {
        const {firstAccessToken} = expect.getState()
        await request(app)
            .get('/posts/1')
            .auth(firstAccessToken, {type: 'bearer'})
            .expect(HTTP_STATUS.NOT_FOUND_404)
    })

    it('11 – PUT: /posts/:id/like-status – return 204 & set like', async() => {
        const {firstAccessToken, firstPost} = expect.getState()
        const setLike = await request(app)
            .put(`/posts/${firstPost.id}/like-status`)
            .auth(firstAccessToken, {type: 'bearer'})
            .send({likeStatus: LikeStatus.Like})

        expect(setLike).toBeDefined()
        expect(setLike.status).toEqual(HTTP_STATUS.NO_CONTENT_204)
    })
    it('12 – GET: /posts/:id – return 200 & get post with 1 like', async () => {
        const {firstAccessToken, firstPost, firstUser, firstCreatedUser} = expect.getState()
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
                        userId: firstCreatedUser.id,
                        login: firstUser.login
                    }
                ]
            }
        })
    })
    it('13 – PUT: /posts/:id/like-status – return 204 & set dislike', async() => {
        const {firstAccessToken, firstPost} = expect.getState()
        const setDislike = await request(app)
            .put(`/posts/${firstPost.id}/like-status`)
            .auth(firstAccessToken, {type: 'bearer'})
            .send({likeStatus: LikeStatus.Dislike})

        expect(setDislike).toBeDefined()
        expect(setDislike.status).toEqual(HTTP_STATUS.NO_CONTENT_204)
    })
    it('14 – GET: /posts/:id – return 200 & get post with 1 dislike', async () => {
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
    it('15 – PUT: /posts/:id/like-status – return 204 & delete dislike', async() => {
        const {firstAccessToken, firstPost} = expect.getState()
        const setNone = await request(app)
            .put(`/posts/${firstPost.id}/like-status`)
            .auth(firstAccessToken, {type: 'bearer'})
            .send({likeStatus: LikeStatus.None})

        expect(setNone).toBeDefined()
        expect(setNone.status).toEqual(HTTP_STATUS.NO_CONTENT_204)
    })
    it('16 – GET: /posts/:id – return 200 & get post', async () => {
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

    it('17 – POST: /auth/login – return 200, 2nd user login and refreshToken', async() => {
        const {secondUser} = expect.getState()
        const secondLoginResponse = await request(app)
            .post('/auth/login')
            .send({
                loginOrEmail: secondUser.login,
                password: secondUser.password
            })

        expect(secondLoginResponse).toBeDefined()
        expect(secondLoginResponse.status).toBe(HTTP_STATUS.OK_200)
        expect(secondLoginResponse.body).toEqual({accessToken: expect.any(String)})
        const {accessToken} = secondLoginResponse.body

        expect.setState({secondAccessToken: accessToken})
    })
    it('18 – POST: /auth/login – return 200, 3rd user login and refreshToken', async() => {
        const {thirdUser} = expect.getState()
        const thirdLoginResponse = await request(app)
            .post('/auth/login')
            .send({
                loginOrEmail: thirdUser.login,
                password: thirdUser.password
            })

        expect(thirdLoginResponse).toBeDefined()
        expect(thirdLoginResponse.status).toBe(HTTP_STATUS.OK_200)
        expect(thirdLoginResponse.body).toEqual({accessToken: expect.any(String)})
        const {accessToken} = thirdLoginResponse.body

        expect.setState({thirdAccessToken: accessToken})
    })
    it('19 – POST: /auth/login – return 200, 4th user login and refreshToken', async() => {
        const {fourthUser} = expect.getState()
        const fourthLoginResponse = await request(app)
            .post('/auth/login')
            .send({
                loginOrEmail: fourthUser.login,
                password: fourthUser.password
            })

        expect(fourthLoginResponse).toBeDefined()
        expect(fourthLoginResponse.status).toBe(HTTP_STATUS.OK_200)
        expect(fourthLoginResponse.body).toEqual({accessToken: expect.any(String)})
        const {accessToken} = fourthLoginResponse.body

        expect.setState({fourthAccessToken: accessToken})
    })
    it('20 – POST: /auth/login – return 200, 5th user login and refreshToken', async() => {
        const {fifthUser} = expect.getState()
        const fifthLoginResponse = await request(app)
            .post('/auth/login')
            .send({
                loginOrEmail: fifthUser.login,
                password: fifthUser.password
            })

        expect(fifthLoginResponse).toBeDefined()
        expect(fifthLoginResponse.status).toBe(HTTP_STATUS.OK_200)
        expect(fifthLoginResponse.body).toEqual({accessToken: expect.any(String)})
        const {accessToken} = fifthLoginResponse.body

        expect.setState({fifthAccessToken: accessToken})
    })

    it('21 – PUT: /posts/:id/like-status – return 204 & set like by 2nd user', async() => {
        const {secondAccessToken, firstPost} = expect.getState()
        const setLike = await request(app)
            .put(`/posts/${firstPost.id}/like-status`)
            .auth(secondAccessToken, {type: 'bearer'})
            .send({likeStatus: LikeStatus.Like})

        expect(setLike).toBeDefined()
        expect(setLike.status).toEqual(HTTP_STATUS.NO_CONTENT_204)
    })
    it('22 – PUT: /posts/:id/like-status – return 204 & set like by 3rd user', async() => {
        const {thirdAccessToken, firstPost} = expect.getState()
        const setLike = await request(app)
            .put(`/posts/${firstPost.id}/like-status`)
            .auth(thirdAccessToken, {type: 'bearer'})
            .send({likeStatus: LikeStatus.Like})

        expect(setLike).toBeDefined()
        expect(setLike.status).toEqual(HTTP_STATUS.NO_CONTENT_204)
    })
    it('23 – PUT: /posts/:id/like-status – return 204 & set like by 4th user', async() => {
        const {fourthAccessToken, firstPost} = expect.getState()
        const setLike = await request(app)
            .put(`/posts/${firstPost.id}/like-status`)
            .auth(fourthAccessToken, {type: 'bearer'})
            .send({likeStatus: LikeStatus.Like})

        expect(setLike).toBeDefined()
        expect(setLike.status).toEqual(HTTP_STATUS.NO_CONTENT_204)
    })
    it('24 – PUT: /posts/:id/like-status – return 204 & set like by 5th user', async() => {
        const {fifthAccessToken, firstPost} = expect.getState()
        const setLike = await request(app)
            .put(`/posts/${firstPost.id}/like-status`)
            .auth(fifthAccessToken, {type: 'bearer'})
            .send({likeStatus: LikeStatus.Like})

        expect(setLike).toBeDefined()
        expect(setLike.status).toEqual(HTTP_STATUS.NO_CONTENT_204)
    })

    it('25 – GET: /posts/:id – return 200 & get post by 1st user with 3 likes', async () => {
        const {firstAccessToken, firstPost, thirdUser, fourthUser, fifthUser} = expect.getState()
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
                likesCount: 4,
                dislikesCount: 0,
                myStatus: LikeStatus.None,
                newestLikes: [
                    {
                        addedAt: expect.any(String),
                        userId: expect.any(String),
                        login: fifthUser.login
                    },
                    {
                        addedAt: expect.any(String),
                        userId: expect.any(String),
                        login: fourthUser.login
                    },
                    {
                        addedAt: expect.any(String),
                        userId: expect.any(String),
                        login: thirdUser.login
                    }
                ]
            }
        })
    })
    it('26 – GET: /posts – return 200 and post by 1st user with 3 likes', async() => {
        const {firstRefreshToken, firstPost, blogId, thirdUser, fourthUser, fifthUser} = expect.getState()
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
                        likesCount: 4,
                        dislikesCount: 0,
                        myStatus: firstPost.extendedLikesInfo.myStatus,
                        newestLikes: [
                            {
                                addedAt: expect.any(String),
                                userId: expect.any(String),
                                login: fifthUser.login
                            },
                            {
                                addedAt: expect.any(String),
                                userId: expect.any(String),
                                login: fourthUser.login
                            },
                            {
                                addedAt: expect.any(String),
                                userId: expect.any(String),
                                login: thirdUser.login
                            }
                        ]
                    }
                }
            ]
        })
    })


    afterAll(async () => {
        await mongoose.connection.close()
    })
})