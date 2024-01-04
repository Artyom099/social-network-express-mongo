import express, {Express} from "express";
import cookieParser from "cookie-parser";
import {testsRouter} from "./routes/tests-router";
import {videosRouter} from "./routes/videos-router";
import {blogsRouter} from "./routes/blogs-router";
import {usersRouter} from "./routes/users-router";
import {feedbackRouter} from "./routes/feedback-router";
import {emailRouter} from "./routes/email-router";
import {securityRouter} from "./routes/security-router";
import {postsRouter} from "./routes/posts-router";
import { authRouter } from "./features/auth/auth-router";


export const jsonBodyMiddleware = express.json()

export const applyAppSettings = (app: Express) => {
    app.use(jsonBodyMiddleware)
    app.use(cookieParser())
    app.set('trust proxy', true)

    app.use('/testing', testsRouter())
    app.use('/videos', videosRouter())
    app.use('/blogs', blogsRouter)
    app.use('/posts', postsRouter)
    app.use('/users', usersRouter())
    app.use('/auth', authRouter())
    app.use('/comments', feedbackRouter)
    app.use('/email', emailRouter())
    app.use('/security', securityRouter())
}