import express from "express";
import {getTestsRouter} from "./routes/tests-router";
import {getVideosRouter} from "./routes/videos-router";
import {getBlogsRouter} from "./routes/blogs-router";
import {getPostsRouter} from "./routes/posts-router";

export const app = express()
export const jsonBodyMiddleware = express.json()

app.use(jsonBodyMiddleware)

app.use('/testing', getTestsRouter())
app.use('/videos', getVideosRouter())
app.use('/blogs', getBlogsRouter())
app.use('/posts', getPostsRouter())