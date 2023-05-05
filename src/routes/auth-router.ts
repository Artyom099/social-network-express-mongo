import express, {Request, Response} from "express";
import {usersService} from "../domain/users-service";
import {HTTP_STATUS} from "../utils";
import {AuthDTO, ReqBodyType} from "../types/types";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../middleware/input-validation-middleware";
import {jwtService} from "../application/jwt-service";
import {authMiddlewareBearer} from "../middleware/auth-middleware";
import {authService} from "../domain/auth-service";
import {emailManager} from "../managers/email-manager";

const validationAuth = [
    body('loginOrEmail').isString().trim().notEmpty(),
    body('password').isString().trim().notEmpty()
]
const validationEmail = [
    body('email').isString().trim().notEmpty().isEmail()
]
const validationReg = [
    ...validationEmail,
    body('login').isString().trim().notEmpty().isLength({min: 3, max: 10}).matches('^[a-zA-Z0-9_-]*$'),
    body('password').isString().trim().notEmpty().isLength({min: 6, max: 20}),
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
        // нам приходит код на почту, если он верный, то 204, иначе 400 и текст ошибки
        const verifyEmail = await authService.checkConfirmationCode(req.body.code)
        if (!verifyEmail) {
            res.status(HTTP_STATUS.BAD_REQUEST_400).json({
                errorsMessages: [
                    {
                        message: 'code is incorrect, expired or already been applied',
                        field: 'code'
                    }
                ]
            })
        } else {
            res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
        }
    })

    router.post('/registration', validationReg, inputValidationMiddleware, async (req: Request, res: Response) => {
        // если входные данные для регистрции правильные, то создаем пользователя
        const existUserEmail = await usersService.findUserByLoginOrEmail(req.body.email)
        const existUserLogin = await usersService.findUserByLoginOrEmail(req.body.login)
        if (existUserEmail) {
            res.status(HTTP_STATUS.BAD_REQUEST_400).json({
                errorsMessages: [
                    {
                        message: 'user with the given email already exists',
                        field: 'email'
                    }
                ]
            })
        }
        if (existUserLogin) {
            res.status(HTTP_STATUS.BAD_REQUEST_400).json({
                errorsMessages: [
                    {
                        message: 'user with the given login already exists',
                        field: 'login'
                    }
                ]
            })
        } else {
            await authService.createUser(req.body.login, req.body.password, req.body.email)
            res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
        }
    })

    router.post('/registration-email-resending', validationEmail, inputValidationMiddleware, async (req: Request, res: Response) => {
        // проверяем, существует ли пользователь, подтверждена ли почта, и потом отправляем код
        const existUser = await usersService.findUserByLoginOrEmail(req.body.email)
        if (!existUser || existUser.emailConfirmation.isConfirmed) {
            res.status(HTTP_STATUS.BAD_REQUEST_400).json({
                errorsMessages: [
                    {
                        message: 'email is already confirmed or doesn\'t exist',
                        field: 'email'
                    }
                ]
            })
        } else {
            await emailManager.sendEmailConfirmationMessage(req.body.email)
            res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
        }
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