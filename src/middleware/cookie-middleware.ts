import {NextFunction, Request, Response} from "express";
import {HTTP_STATUS} from "../types/constants";
import {jwtService} from "../application/jwt-service";
import {tokensService} from "../application/tokens-service";


export const cookieMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken
    const tokenInBlackList = await tokensService.checkTokenInBlackList(refreshToken)
    const tokenPayload = await jwtService.getPayloadByToken(refreshToken)

    if (!refreshToken || tokenInBlackList || !tokenPayload!.userId) {
        res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401)
    } else {
        // await tokensService.addTokenToBlackList(refreshToken)
        req.userId = tokenPayload
        return next()
    }
}