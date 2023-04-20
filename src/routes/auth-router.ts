import express, {Response} from "express";
import {usersService} from "../domain/users-service";
import {HTTP_STATUS} from "../utils";
import {AuthType, ReqBodyType} from "../types";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../middleware/input-validation-middleware";

const validationAuth = [
    body('loginOrEmail').isString().trim().notEmpty(),
    body('password').isString().trim().notEmpty(),
]

export const authRouter = () => {
    const router = express.Router()
    router.post('/login', validationAuth, inputValidationMiddleware, async (req: ReqBodyType<AuthType>, res: Response) => {
        const checkResult = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (!checkResult) {
            res.status(HTTP_STATUS.CREATED_201)     //.send(checkResult.data)
        } else {
            res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401)
        }
    })
    return router
}

