import {NextFunction, Request, Response} from "express";
import {HTTP_STATUS} from "../utils/enums";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../../features/user/application/users-service";


export const bearerAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization
    if (!auth) return res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401)

    const [authType, authToken] = auth.split(' ')
    const userId = await jwtService.getUserIdByToken(authToken)

    if (!userId || authType !== 'Bearer') {
        res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401)
    } else {
        req.user = await usersService.findUserById(userId)
        // todo - req.user.id - пихать в запрос только id, чтобы не нагружать его
        // req.userId = user.id
        return next()
    }
}

export const basicAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization
    if (!auth) return res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401)

    const [authType, authValue] = auth.split(' ')

    if (authType !== 'Basic' || authValue !== 'YWRtaW46cXdlcnR5') {
        return res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401)
    } else {
        return next()
    }
}