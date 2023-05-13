import {NextFunction, Response} from "express";
import {HTTP_STATUS} from "../types/constants";
import {jwtService} from "../application/jwt-service";
import {authService} from "../domain/auth-service";


export const cookieMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401)

    const userId = await jwtService.getUserIdByToken(refreshToken)
    if (!userId) return res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401)

    const tokenInBlackList = await authService.checkTokenInBlackList(userId, refreshToken)
    if (tokenInBlackList) return res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401)
    else {
        await authService.addTokenToBlackList(userId, refreshToken)
        req.userId = userId
        return next()
    }
}