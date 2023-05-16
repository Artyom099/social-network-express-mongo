import {Request, Response, NextFunction} from "express";
import {HTTP_STATUS} from "../types/constants";
import {ipService} from "../domain/ip-service";


export const rateLimitMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // const {ip, url, date} = {req.socket.localAddress, req.baseUrl, new Date()}
    const ip = req.socket.localAddress
    const url = req.baseUrl
    const date = new Date()
    const foundIP = ipService.findIpAndUrl(ip, url)

    // add(new Date, {seconds: 10}
    if (foundIP.date >= date.getSeconds() - 10) {
        res.sendStatus(HTTP_STATUS.TOO_MANY_REQUESTS_429)
    } else {
        return next()
    }
}