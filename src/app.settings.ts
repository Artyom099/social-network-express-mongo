import express, {Express} from "express";
import cookieParser from "cookie-parser";
import {testsRouter} from "./features/test/tests-router";
import {videosRouter} from "./features/video/videos-router";
import {blogsRouter} from "./features/blog/api/blogs-router";
import {usersRouter} from "./features/user/api/users-router";
import {commentsRouter} from "./features/comments/api/comments-router";
import {emailRouter} from "./infrastructure/email/email-router";
import {deviceRouter} from "./features/device/device-router";
import {postsRouter} from "./features/post/api/posts-router";
import { authRouter } from "./features/auth/auth-router";

export const jsonBodyMiddleware = express.json()

export const appSettings = (app: Express) => {
    app.use(jsonBodyMiddleware)
    app.use(cookieParser())
    app.set('trust proxy', true)

    app.use('/testing', testsRouter())
    app.use('/videos', videosRouter())
    app.use('/blogs', blogsRouter)
    app.use('/posts', postsRouter)
    app.use('/users', usersRouter())
    app.use('/auth', authRouter())
    app.use('/comments', commentsRouter)
    app.use('/email', emailRouter())
    app.use('/security', deviceRouter())
}