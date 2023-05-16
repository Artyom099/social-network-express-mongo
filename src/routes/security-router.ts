import express, {Request, Response} from "express";
import {cookieMiddleware} from "../middleware/cookie-middleware";
import {HTTP_STATUS} from "../types/constants";
import {securityService} from "../application/security-service";


export const securityRouter = () => {
    const router = express.Router()

    router.get('/devices', cookieMiddleware, async (req: Request, res: Response) => {
        const ip = req.ip

        const loginDevices = await securityService.finaAllLoginDevicesByUserId(userId)
        res.status(HTTP_STATUS.OK_200).json()
    })

    router.delete('/devices', cookieMiddleware, async (req: Request, res: Response) => {

    })

    router.delete('/devices/:deviceId', cookieMiddleware, async (req: Request, res: Response) => {

    })

    return router
}