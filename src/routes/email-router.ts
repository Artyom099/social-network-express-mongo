import express, {Request, Response} from "express";
import {emailAdapter} from "../adapters/email-adapter";


export const emailRouter = () => {
    const router = express.Router()

    router.post('/send', async (req: Request, res: Response) => {
        await emailAdapter.sendEmail(req.body.email, req.body.subject, req.body.message)
    })

    return router
}