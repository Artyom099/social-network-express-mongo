import express, {Request, Response} from "express";
import {cookieMiddleware} from "../middleware/cookie-middleware";


export const securityRouter = () => {
    const router = express.Router()

    router.get('/devices', cookieMiddleware, async (req: Request, res: Response) => {

    })

    router.delete('/devices', cookieMiddleware, async (req: Request, res: Response) => {

    })

    router.delete('/devices/:deviceId', cookieMiddleware, async (req: Request, res: Response) => {

    })

    return router
}