import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";


export const checkUserIdMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization
    if (!auth) {
        req.body.userId = null
    } else {
        const [authType, authToken] = auth.split(' ')
        req.body.userId = await jwtService.getUserIdByToken(authToken)
        console.log('1234')
    }
    next()
}