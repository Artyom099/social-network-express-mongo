import {HTTP_STATUS} from "../utils/enums";
import { ValidationError, validationResult } from 'express-validator';
import {Request, Response, NextFunction} from 'express';

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const err = errors.array({onlyFirstError: true}).map((e: ValidationError) => {
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