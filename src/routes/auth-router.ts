import express, {Request, Response} from "express";
import {usersService} from "../domain/users-service";
import {HTTP_STATUS} from "../utils";
import {AuthDTO, ReqBodyType} from "../types";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../middleware/input-validation-middleware";
import {jwtService} from "../application/jwt-service";
import {authMiddlewareBearer} from "../middleware/auth-middleware";

const validationAuth = [
    body('loginOrEmail').isString().trim().notEmpty(),
    body('password').isString().trim().notEmpty()
]
const validationReg = [
    body('login').isString().trim().notEmpty().isLength({min: 3, max: 10}).matches('^[a-zA-Z0-9_-]*$'),
    body('password').isString().trim().notEmpty().isLength({min: 6, max: 20}),
    body('email').isString().trim().notEmpty().isEmail
]

export const authRouter = () => {
    const router = express.Router()

    router.post('/login', validationAuth, inputValidationMiddleware, async (req: ReqBodyType<AuthDTO>, res: Response) => {
        const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (user) {
            const token = await jwtService.createJWT(user)
            res.status(HTTP_STATUS.OK_200).json({'accessToken': token})
        } else {
            res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401)
        }
    })

    router.post('/registration-confirmation', async (req: Request, res: Response) => {
    // нам приходит код, мы проверяем, верный он или нет
    })

    router.post('/registration', validationReg, inputValidationMiddleware, async (req: Request, res: Response) => {
        await usersService.createUser(req.body.login, req.body.password, req.body.email)
        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
    })

    router.post('/registration-email-resending', async (req: Request, res: Response) => {

    })

    router.get('/me', authMiddlewareBearer, async (req: Request, res: Response) => {
        res.status(HTTP_STATUS.OK_200).json({
            email: req.user!.email,
            login: req.user!.login,
            userId: req.user!.id
        })
    })

    return router
}