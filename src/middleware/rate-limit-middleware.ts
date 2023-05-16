import {Request, Response, NextFunction} from "express";
import {HTTP_STATUS} from "../types/constants";
import {ipService} from "../domain/ip-service";


export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.socket.localAddress
    const url = req.baseUrl
    const date = new Date()
    if (!ip) {
        return res.sendStatus(HTTP_STATUS.BAD_REQUEST_400)
    }
    const foundIP = await ipService.findIpAndUrl(ip, url)
    if (!foundIP) {
        return res.sendStatus(HTTP_STATUS.BAD_REQUEST_400)
    }

    if (foundIP.date >= new Date(date.getSeconds() - 10)) {
        res.sendStatus(HTTP_STATUS.TOO_MANY_REQUESTS_429)
    } else {
        return next()
    }
}