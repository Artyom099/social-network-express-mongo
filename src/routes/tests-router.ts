import express, {Request, Response} from "express";
import {HTTP_STATUS} from "../utils";
import {TDataBase} from "../types";
import {testsRepository} from "../repositories/tests-repository";

export const getTestsRouter = (db: TDataBase) => {
    const router = express.Router()
    router.delete('/all-data', (req: Request, res: Response) => {
        const cleanedDB = testsRepository.deleteAllData()   // todo правильно ли?
        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
    })
    return router
}