import express, {Request, Response} from "express";
import {cookieMiddleware} from "../middleware/cookie-middleware";
import {HTTP_STATUS} from "../types/constants";
import {securityService} from "../application/security-service";
import {ReqParamsType} from "../types/types";
import {jwtService} from "../application/jwt-service";


export const securityRouter = () => {
    const router = express.Router()

    router.get('/devices', cookieMiddleware, async (req: Request, res: Response) => {
        // Returns all devices with active sessions for current user const ip = req.ip
        const refreshToken = req.cookies.refreshToken
        const userId = await jwtService.getUserIdByToken(refreshToken)
        const loginDevices = await securityService.finaAllLoginDevicesByUserId(userId!)
        res.status(HTTP_STATUS.OK_200).json(loginDevices)
    })

    router.delete('/devices', cookieMiddleware, async (req: Request, res: Response) => {
        // Terminate all other (exclude current) device's sessions
        const refreshToken = req.cookies.refreshToken
        const userId = await jwtService.getUserIdByToken(refreshToken)
        await securityService.deleteOtherActiveSessionsByUserId(userId!)
        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
    })

    router.delete('/devices/:deviceId', cookieMiddleware, async (req: ReqParamsType<{ deviceId: string }>, res: Response) => {
        // Terminate specified device session
        // todo добавить проверку, что девайс принадлежит этому юзеру
        const refreshToken = req.cookies.refreshToken
        const userId = await jwtService.getUserIdByToken(refreshToken)
        const loginDevices = await securityService.finaAllLoginDevicesByUserId(userId!)
        const foundDevice = securityService.findActiveSessionByDeviceId(req.params.deviceId)

        if (!foundDevice && !loginDevices.includes(foundDevice)) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        } else {
            await securityService.deleteActiveSessionByDeviceId(req.params.deviceId)
            res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
        }
    })

    return router
}