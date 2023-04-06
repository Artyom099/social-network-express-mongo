import {HTTP_STATUS} from "../utils";
import {Request, Response, NextFunction} from "express";
import {ValidationError, validationResult} from "express-validator";

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errorFormatter = ({ param }: ValidationError) => {
        return {
            message: 'incorrect input data',
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