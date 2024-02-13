import {NextFunction, Request, Response} from "express";
import {HTTP_STATUS} from "../utils/enums";
import {jwtService} from "../application/jwt-service";


export const cookieMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken
    const userId = await jwtService.getUserIdByToken(refreshToken)

    if (!refreshToken || !userId) {
        res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401)
    } else {
        req.userId = userId
        return next()
    }
}