import express, {Request, Response} from "express";
import {HTTP_STATUS} from "../../infrastructure/utils/enums";
import {testsRepository} from "./tests-repository";

export const testsRouter = () => {
    const router = express.Router()
    router.delete('/all-data', async (req: Request, res: Response) => {
        await testsRepository.deleteAllData()
        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
    })
    return router
}