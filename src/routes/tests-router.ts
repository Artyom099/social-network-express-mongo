import express, {Request, Response} from "express";
import {HTTP_STATUS} from "../utils";
import {testsRepository} from "../repositories/tests-repository";

export const getTestsRouter = () => {
    const router = express.Router()
    router.delete('/all-data', async (req: Request, res: Response) => {
        await testsRepository.deleteAllData()
        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
    })
    return router
}