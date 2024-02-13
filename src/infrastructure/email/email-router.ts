import express, {Request, Response} from "express";
import {emailManager} from "./email-manager";


export const emailRouter = () => {
    const router = express.Router()

    router.post('/send', async (req: Request, res: Response) => {
        // await emailManager.sendEmailRecoveryCode(req.body.user)
    })

    return router
}