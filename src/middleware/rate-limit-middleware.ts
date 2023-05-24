import {Request, Response, NextFunction} from "express";
import {HTTP_STATUS} from "../types/constants";
import {ipService} from "../application/ip-service";


export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip
    const url = req.originalUrl
    // console.log('ip - ', ip)
    // console.log('url - ', url)
    const dateNow = new Date()
    const timeLimit = new Date(Date.now() - 10_000).toISOString()
    const countFoundIP = await ipService.countIpAndUrl(ip!, url, timeLimit)
    console.log('countFoundIP', countFoundIP, 'dateNow', dateNow, 'timeLimit', timeLimit)

    if (countFoundIP! > 4) {
        res.sendStatus(HTTP_STATUS.TOO_MANY_REQUESTS_429)
    } else {
        await ipService.addIpAndUrl(ip!, url, dateNow.toISOString())
        return next()
    }
}