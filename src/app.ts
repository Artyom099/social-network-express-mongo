import express from "express";
import {db} from "./db/db";
import {getTestsRouter} from "./routes/tests-router";
import {getVideosRouter} from "./routes/videos-router";
import {getBlogsRouter} from "./routes/blogs-router";

export const app = express()
export const jsonBodyMiddleware = express.json()

app.use(jsonBodyMiddleware)

app.use('/testing', getTestsRouter(db))
app.use('/videos', getVideosRouter(db))
app.use('/blogs', getBlogsRouter(db))