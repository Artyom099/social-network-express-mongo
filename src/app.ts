import express from "express";
import {getVideosRouter} from "./routes/videos-router";
import {getTestsRouter} from "./routes/tests-router";
import {db} from "./db/db";

export const app = express()
export const jsonBodyMiddleware = express.json()

app.use(jsonBodyMiddleware)

app.use('/testing', getTestsRouter(db))
app.use('/videos', getVideosRouter(db))
//app.use('/blogs', getBlogsRouter(db))