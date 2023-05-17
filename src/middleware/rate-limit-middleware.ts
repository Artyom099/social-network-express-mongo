import {Request, Response, NextFunction} from "express";
import {HTTP_STATUS} from "../types/constants";
import {ipService} from "../application/ip-service";


export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.socket.localAddress
    const url = req.baseUrl
    const dateNow = new Date()
    const date = new Date(dateNow.getSeconds() - 10).toISOString()
    if (!ip) {
        return res.sendStatus(HTTP_STATUS.BAD_REQUEST_400)
    }
    const countFoundIP = await ipService.countIpAndUrl(ip, url, date)
    if (!countFoundIP) {
        return res.sendStatus(HTTP_STATUS.BAD_REQUEST_400)
    }

    if (countFoundIP > 5) {
        res.sendStatus(HTTP_STATUS.TOO_MANY_REQUESTS_429)
    } else {
        req.ip = ip
        return next()
    }
}