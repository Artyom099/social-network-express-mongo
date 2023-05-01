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
    body('email').isString().trim().notEmpty().isEmail
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
    // нам приходит код, если он верный, то 204, иначе 400 и текст ошибки
        const verifyEmail = await authService.checkConfirmationCode(req.body.code)
        if (!verifyEmail) {
            throw new Error()
            res.sendStatus(HTTP_STATUS.BAD_REQUEST_400)
        } else {
            res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
        }
    })

    router.post('/registration', validationReg, inputValidationMiddleware, async (req: Request, res: Response) => {
        await emailManager.sendEmailConfirmationMessage(req.body.email)
        await authService.createUser(req.body.login, req.body.password, req.body.email)
        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
    })

    router.post('/registration-email-resending', validationEmail, inputValidationMiddleware, async (req: Request, res: Response) => {
        await emailManager.sendEmailConfirmationMessage(req.body.email)
        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
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