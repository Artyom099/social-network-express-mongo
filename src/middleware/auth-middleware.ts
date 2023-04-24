import {NextFunction, Request, Response} from "express";
import {HTTP_STATUS} from "../utils";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../domain/users-service";


export const authMiddlewareBearer = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.send(HTTP_STATUS.UNAUTHORIZED_401)
        return
    }
    const token = req.headers.authorization.split(' ')[1]
    const userId = await jwtService.getUserIdByToken(token)
    if (userId) {
        req.body = await usersService.findUserById(String(userId))
        next()
    }
    res.send(HTTP_STATUS.UNAUTHORIZED_401)
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