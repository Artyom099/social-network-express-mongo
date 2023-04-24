import express, {Request, Response} from "express";
import {usersService} from "../domain/users-service";
import {HTTP_STATUS} from "../utils";
import {AuthType, ReqBodyType} from "../types";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../middleware/input-validation-middleware";
import {jwtService} from "../application/jwt-service";
import {authMiddlewareBearer} from "../middleware/auth-middleware";

const validationAuth = [
    body('loginOrEmail').isString().trim().notEmpty(),
    body('password').isString().trim().notEmpty(),
]

export const authRouter = () => {
    const router = express.Router()
    router.post('/login', validationAuth, inputValidationMiddleware, async (req: ReqBodyType<AuthType>, res: Response) => {
        const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (user) {
            const token = await jwtService.createJWT(user)
            res.sendStatus(HTTP_STATUS.CREATED_201).send(token)
        } else {
            res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401)
        }
    })

    router.get('/me', authMiddlewareBearer, async (req: Request, res: Response) => {
        const foundUser = await usersService.findUserById(req.body.userId)
        res.status(HTTP_STATUS.OK_200).json(foundUser)
    })

    return router
}