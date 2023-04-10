import {HTTP_STATUS} from "../utils";
import {validationResult} from "express-validator";
import {Request, Response, NextFunction} from "express";


export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const err = errors.array({onlyFirstError: true}).map(e => {
            return {
                message: e.msg,
                field: e.param
            }
        })
        res.status(HTTP_STATUS.BAD_REQUEST_400).json({errorsMessages: err})
    } else {
        next()
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization
    if (!auth) return res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401)
    const [authType, authValue] = auth.split(' ')
    if (authType !== 'Basic' || authValue !== 'YWRtaW46cXdlcnR5') {
        return res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401)
    } else {
        return next()
    }

}