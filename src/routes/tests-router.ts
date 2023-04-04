import express, {Request, Response} from "express";
import {HTTP_STATUS} from "../utils";
import {TDataBase} from "../types";

export const getTestsRouter = (db: TDataBase) => {
    const router = express.Router()
    router.delete('/all-data', (req: Request, res: Response) => {
        db.videos = []
        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
    })
    return router
}