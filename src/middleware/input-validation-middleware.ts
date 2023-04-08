import {HTTP_STATUS} from "../utils";
import {Request, Response, NextFunction} from "express";
import {ValidationError, validationResult} from "express-validator";


export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errorFormatter = ({ param, msg }: ValidationError) => {
        return {
            message: `${msg}`,
            field: `${param}`
        }
    }
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        res.status(HTTP_STATUS.BAD_REQUEST_400).json({ errorsMessages: errors.array() })
    } else {
        next()
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization!.split(':')
    if (!auth || auth[1] !== 'YWRtaW46cXdlcnR5') {
        res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401)
    } else {
        next ()
    }
}