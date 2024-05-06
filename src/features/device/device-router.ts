import express, {Request, Response} from "express";
import {HTTP_STATUS} from "../../infrastructure/utils/enums";
import {deviceService} from "./device-service";
import {ReqParamsType} from "../../types";
import {jwtService} from "../../infrastructure/application/jwt-service";
import {cookieMiddleware} from '../../infrastructure/middleware/cookie-middleware';


export const deviceRouter = () => {
    const router = express.Router()

    router.get('/devices', cookieMiddleware, async (req: Request, res: Response) => {
        // Returns all devices with active sessions for current user
        const payload = await jwtService.getPayloadByToken(req.cookies.refreshToken)
        const activeSessions = await deviceService.finaAllActiveSessionsByUserId(payload.userId)

        res.status(HTTP_STATUS.OK_200).json(activeSessions)
    })

    router.delete('/devices', cookieMiddleware, async (req: Request, res: Response) => {
        // Terminate all other (exclude current) device's sessions
        const payload = await jwtService.getPayloadByToken(req.cookies.refreshToken)
        await deviceService.deleteOtherActiveSessionsByDeviceId(payload!.deviceId)

        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
    })

    router.delete('/devices/:deviceId', cookieMiddleware, async (req: ReqParamsType<{ deviceId: string }>, res: Response) => {
        // Terminate specified device session
        const currentSession = await deviceService.findActiveSessionByDeviceId(req.params.deviceId)
        if (!currentSession) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)

        const payload = await jwtService.getPayloadByToken(req.cookies.refreshToken)
        const activeSessions = await deviceService.finaAllActiveSessionsByUserId(payload.userId)

        if (!activeSessions.find(session => session.deviceId === currentSession.deviceId)) {
            res.sendStatus(HTTP_STATUS.FORBIDDEN_403)
        } else {
            await deviceService.deleteCurrentSessionByDeviceId(req.params.deviceId)
            res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
        }
    })

    return router
}