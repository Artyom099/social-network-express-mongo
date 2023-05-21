import {NextFunction, Request, Response} from "express";
import {HTTP_STATUS} from "../types/constants";
import {jwtService} from "../application/jwt-service";


export const cookieMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken
    // const tokenInBlackList = await tokensService.checkTokenInBlackList(refreshToken)
    const userId = await jwtService.getUserIdByToken(refreshToken)

    if (!refreshToken || !userId) {   // tokenInBlackList ||
        res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401)
    } else {
        // await tokensService.addTokenToBlackList(refreshToken)
        req.userId = userId
        return next()
    }
}