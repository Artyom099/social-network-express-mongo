import {Request, Response, NextFunction} from "express";
import {HTTP_STATUS} from "../types/constants";
import {ipService} from "../application/ip-service";


export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip
    const url = req.originalUrl
    const dateNow = Date.now()
    const timeLimit = new Date(dateNow - 10_000)
    const countFoundIP = await ipService.countIpAndUrl(ip!, url, timeLimit)
    console.log('countFoundIP', countFoundIP, 'url', url, 'dateNow', new Date(dateNow), 'timeLimit', timeLimit)

    if (countFoundIP! >= 5) {
        res.sendStatus(HTTP_STATUS.TOO_MANY_REQUESTS_429)
    } else {
        await ipService.addIpAndUrl(ip!, url, new Date(dateNow))
        return next()
    }
}