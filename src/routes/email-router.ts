import express, {Request, Response} from "express";
import {emailManager} from "../managers/email-manager";


export const emailRouter = () => {
    const router = express.Router()

    router.post('/send', async (req: Request, res: Response) => {
        await emailManager.sendPasswordRecoveryMessage(req.body.user)
    })

    return router
}