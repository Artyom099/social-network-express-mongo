import {NextFunction, Request, Response} from "express";
import {HTTP_STATUS} from "../utils";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../domain/users-service";


export const authMiddlewareBearer = async (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization
    if (!auth) return res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401)
    const [authType, authToken] = auth.split(' ')
    const userId = await jwtService.getUserIdByToken(authToken)

    if (!userId || authType !== 'Bearer') {
        res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401)
    } else {
        req.body.user = await usersService.findUserById(String(userId))
        return next()
    }
}

export const authMiddlewareBasic = (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization
    if (!auth) return res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401)
    const [authType, authValue] = auth.split(' ')

    if (authType !== 'Basic' || authValue !== 'YWRtaW46cXdlcnR5') {
        return res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401)
    } else {
        return next()
    }
}