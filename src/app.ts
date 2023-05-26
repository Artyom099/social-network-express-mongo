import express from "express";
import cookieParser from "cookie-parser";
import {testsRouter} from "./routes/tests-router";
import {videosRouter} from "./routes/videos-router";
import {blogsRouter} from "./routes/blogs-router";
import {postsRouter} from "./routes/posts-router";
import {usersRouter} from "./routes/users-router";
import {authRouter} from "./routes/auth-router";
import {feedbackRouter} from "./routes/feedback-router";
import {emailRouter} from "./routes/email-router";
import {securityRouter} from "./routes/security-router";

export const app = express()
export const jsonBodyMiddleware = express.json()

app.use(jsonBodyMiddleware)
app.use(cookieParser())
app.set('trust proxy', true)


app.use('/testing', testsRouter())
app.use('/videos', videosRouter())
app.use('/blogs', blogsRouter())
app.use('/posts', postsRouter())
app.use('/users', usersRouter())
app.use('/auth', authRouter())
app.use('/comments', feedbackRouter())
app.use('/email', emailRouter())
app.use('/security', securityRouter())