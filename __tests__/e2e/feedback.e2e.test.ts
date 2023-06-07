import request from "supertest";
import {app} from "../../src";
import {HTTP_STATUS, LikeStatus} from "../../src/utils/constants";
import {getRefreshTokenByResponse, getRefreshTokenByResponseWithTokenName} from "../../src/utils/utils";
import mongoose from "mongoose";
import {mongoURI2} from "../../src/db/db";


describe('/feedback', () => {
    beforeAll(async () => {
        await mongoose.connect(mongoURI2)
        await request(app).delete ('/testing/all-data')
    })

    it('1 – /users – create 1st user by admin', async () => {
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
    it('2 – /users – create 2nd user by admin', async () => {
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
    it('2 – /auth/login – return 200, 1st login and refreshToken', async () => {
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
                myStatus: LikeStatus.None
            }
        })
        // console.log({commentId_5: createCommentResponse.body.id})
        expect.setState({commentId: createCommentResponse.body.id})
    });

    it('6 – /comments/:commentId/like-status – return 404 – non exist comment', async () => {
        const {firstAccessToken} = expect.getState()
        const setLike = await request(app)
            .put(`/comments/${123}/like-status`)
            .auth(firstAccessToken, {type: 'bearer'})
            .send({likeStatus: LikeStatus.Like})

        expect(setLike).toBeDefined()
        expect(setLike.status).toEqual(HTTP_STATUS.NOT_FOUND_404)
    });
    it('7 – /comments/:commentId/like-status – return 400 – likeStatus: invalid', async () => {
        const {commentId, firstAccessToken} = expect.getState()
        const setLike = await request(app)
            .put(`/comments/${commentId}/like-status`)
            .auth(firstAccessToken, {type: 'bearer'})
            .send({likeStatus: 'invalid'})

        expect(setLike).toBeDefined()
        expect(setLike.status).toEqual(HTTP_STATUS.BAD_REQUEST_400)
    });
    it('8 – /comments/:commentId/like-status – return 401 – likeStatus: invalid', async () => {
        const {commentId} = expect.getState()
        const setLike = await request(app)
            .put(`/comments/${commentId}/like-status`)
            .send({likeStatus: LikeStatus.Like})

        expect(setLike).toBeDefined()
        expect(setLike.status).toEqual(HTTP_STATUS.UNAUTHORIZED_401)
    });

    it('9 – /comments/:id – return 200 & found comment', async () => {
        const {commentId, firstUser, firstCreatedUser} = expect.getState()
        const getComment = await request(app)
            .get(`/comments/${commentId}`)

        expect(getComment).toBeDefined()
        expect(getComment.status).toEqual(HTTP_STATUS.OK_200)
        expect(getComment.body).toEqual({
            id: commentId,
            content: 'valid-super-long-content',
            commentatorInfo: {
                userId: firstCreatedUser.id,
                userLogin: firstUser.login
            },
            createdAt: expect.any(String),
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: LikeStatus.None
            }
        })
    });

    it('10 – /comments/:commentId/like-status – return 204 & set like', async () => {
        const {commentId, firstAccessToken} = expect.getState()
        const setLike = await request(app)
            .put(`/comments/${commentId}/like-status`)
            .auth(firstAccessToken, {type: 'bearer'})
            .send({likeStatus: LikeStatus.Like})

        // console.log({commentId_10: commentId})
        expect(setLike).toBeDefined()
        expect(setLike.status).toEqual(HTTP_STATUS.NO_CONTENT_204)
    });
    it('11 – /comments/:id – return 200 & found comment', async () => {
        const {commentId, firstUser, firstCreatedUser, firstAccessToken} = expect.getState()
        const getComment = await request(app)
            .get(`/comments/${commentId}`)
            .auth(firstAccessToken, {type: 'bearer'})

        expect(getComment).toBeDefined()
        expect(getComment.status).toEqual(HTTP_STATUS.OK_200)
        expect(getComment.body).toEqual({
            id: commentId,
            content: 'valid-super-long-content',
            commentatorInfo: {
                userId: firstCreatedUser.id,
                userLogin: firstUser.login
            },
            createdAt: expect.any(String),
            likesInfo: {
                likesCount: 1,
                dislikesCount: 0,
                myStatus: LikeStatus.Like
            }
        })
    });

    it('12 – /comments/:commentId/like-status – return 204 & set dislike', async () => {
        const {commentId, firstAccessToken} = expect.getState()
        const setDislike = await request(app)
            .put(`/comments/${commentId}/like-status`)
            .auth(firstAccessToken, {type: 'bearer'})
            .send({likeStatus: LikeStatus.Dislike})

        expect(setDislike).toBeDefined()
        expect(setDislike.status).toEqual(HTTP_STATUS.NO_CONTENT_204)
    });
    it('13 – /comments/:id – return 200 & found comment', async () => {
        const {commentId, firstUser, firstCreatedUser} = expect.getState()
        const getComment = await request(app)
            .get(`/comments/${commentId}`)

        expect(getComment).toBeDefined()
        expect(getComment.status).toEqual(HTTP_STATUS.OK_200)
        expect(getComment.body).toEqual({
            id: commentId,
            content: 'valid-super-long-content',
            commentatorInfo: {
                userId: firstCreatedUser.id,
                userLogin: firstUser.login
            },
            createdAt: expect.any(String),
            likesInfo: {
                likesCount: 0,
                dislikesCount: 1,
                myStatus: LikeStatus.Dislike
            }
        })
    });

    it('14 – /comments/:commentId/like-status – return 204 & delete dislike', async () => {
        const {commentId, firstAccessToken} = expect.getState()
        const deleteDislike = await request(app)
            .put(`/comments/${commentId}/like-status`)
            .auth(firstAccessToken, {type: 'bearer'})
            .send({likeStatus: LikeStatus.None})

        expect(deleteDislike).toBeDefined()
        expect(deleteDislike.status).toEqual(HTTP_STATUS.NO_CONTENT_204)
    });
    it('15 – /comments/:id – return 200 & found comment', async () => {
        const {commentId, firstUser, firstCreatedUser} = expect.getState()
        const getComment = await request(app)
            .get(`/comments/${commentId}`)

        expect(getComment).toBeDefined()
        expect(getComment.status).toEqual(HTTP_STATUS.OK_200)
        expect(getComment.body).toEqual({
            id: commentId,
            content: 'valid-super-long-content',
            commentatorInfo: {
                userId: firstCreatedUser.id,
                userLogin: firstUser.login
            },
            createdAt: expect.any(String),
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: LikeStatus.None
            }
        })
    });

    it('16 – /auth/login – return 200, 1st login and refreshToken', async () => {
        const {secondUser} = expect.getState()
        const loginResponse = await request(app)
            .post('/auth/login')
            .send({
                loginOrEmail: secondUser.login,
                password: secondUser.password
            })

        expect(loginResponse).toBeDefined()
        expect(loginResponse.status).toBe(HTTP_STATUS.OK_200)
        expect(loginResponse.body).toEqual({accessToken: expect.any(String)})
        const {accessToken} = loginResponse.body

        const refreshToken = getRefreshTokenByResponse(loginResponse)
        const refreshTokenWithName = getRefreshTokenByResponseWithTokenName(loginResponse)
        expect(refreshToken).toBeDefined()
        expect(refreshToken).toEqual(expect.any(String))

        expect.setState({secondAccessToken: accessToken, secondRefreshToken: refreshToken, secondRefreshTokenWithName: refreshTokenWithName})
    })

    it('17 – /comments/:commentId/like-status – return 204 & set 2 likes', async () => {
        const {commentId, firstAccessToken} = expect.getState()
        const setLikeFirstUser = await request(app)
            .put(`/comments/${commentId}/like-status`)
            .auth(firstAccessToken, {type: 'bearer'})
            .send({likeStatus: LikeStatus.Like})
        expect(setLikeFirstUser).toBeDefined()
        expect(setLikeFirstUser.status).toEqual(HTTP_STATUS.NO_CONTENT_204)

        const {secondAccessToken} = expect.getState()
        const setLikeSecondUser = await request(app)
            .put(`/comments/${commentId}/like-status`)
            .auth(secondAccessToken, {type: 'bearer'})
            .send({likeStatus: LikeStatus.Like})
        expect(setLikeSecondUser).toBeDefined()
        expect(setLikeSecondUser.status).toEqual(HTTP_STATUS.NO_CONTENT_204)

        const {firstUser, firstCreatedUser} = expect.getState()
        const getComment = await request(app)
            .get(`/comments/${commentId}`)

        expect(getComment).toBeDefined()
        expect(getComment.status).toEqual(HTTP_STATUS.OK_200)
        expect(getComment.body).toEqual({
            id: commentId,
            content: 'valid-super-long-content',
            commentatorInfo: {
                userId: firstCreatedUser.id,
                userLogin: firstUser.login
            },
            createdAt: expect.any(String),
            likesInfo: {
                likesCount: 2,
                dislikesCount: 0,
                myStatus: LikeStatus.Like
            }
        })
    });

    it('18 – /comments/:id – return 200 & found comment', async () => {
        const {commentId, firstUser, firstCreatedUser} = expect.getState()
        const getComment = await request(app)
            .get(`/comments/${commentId}`)

        expect(getComment).toBeDefined()
        expect(getComment.status).toEqual(HTTP_STATUS.OK_200)
        expect(getComment.body).toEqual({
            id: commentId,
            content: 'valid-super-long-content',
            commentatorInfo: {
                userId: firstCreatedUser.id,
                userLogin: firstUser.login
            },
            createdAt: expect.any(String),
            likesInfo: {
                likesCount: 2,
                dislikesCount: 0,
                myStatus: LikeStatus.Like
            }
        })
    });

    afterAll(async () => {
        await mongoose.connection.close()
    })
})