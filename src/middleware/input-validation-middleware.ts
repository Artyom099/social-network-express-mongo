import {NextFunction} from "express";
import {ValidationError, validationResult} from "express-validator";
import {HTTP_STATUS} from "../utils";


export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorFormatter = ({ param }: ValidationError) => {
            return {
                message: 'incorrect input data',
                field: `${param}`
            }
        }
        const errors = validationResult(req).formatWith(errorFormatter);
        res.status(HTTP_STATUS.BAD_REQUEST_400).json({ errorsMessages: errors.array() })
    } else {
        next()
    }
}