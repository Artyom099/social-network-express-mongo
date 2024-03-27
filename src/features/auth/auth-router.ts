import express, {Request, Response} from "express";
import {usersService} from "../user/application/users-service";
import {HTTP_STATUS} from "../../infrastructure/utils/enums";
import {AuthDTO, PassCodeDTO, ReqBodyType, UserRegDTO} from "../../infrastructure/types/types";
import {body} from "express-validator";
import {jwtService} from "../../infrastructure/application/jwt-service";
import {authService} from "./auth-service";
import {securityService} from "../device/security-service";
import {rateLimitMiddleware} from '../../infrastructure/middleware/rate-limit-middleware';
import {inputValidationMiddleware} from '../../infrastructure/middleware/input-validation-middleware';
import {cookieMiddleware} from '../../infrastructure/middleware/cookie-middleware';
import {bearerAuthMiddleware} from '../../infrastructure/middleware/auth-middleware';

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

const validationPassAndCode = [
    body('newPassword').isString().trim().notEmpty().isLength({min: 6, max: 20}),
    body('recoveryCode').isString().trim().notEmpty()
]


export const authRouter = () => {
    const router = express.Router()

    router.post('/login', rateLimitMiddleware, validationAuth, inputValidationMiddleware, async (req: ReqBodyType<AuthDTO>, res: Response) => {
        const userId = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (userId) {
            const title = req.headers['user-agent']
            const token = await jwtService.createJWT(userId)
            const tokenPayload = await jwtService.getPayloadByToken(token.refreshToken)
            const lastActiveDate = new Date(tokenPayload.iat * 1000).toISOString()
            await securityService.addActiveSession(req.ip!, title!, lastActiveDate, tokenPayload.deviceId, userId)

            res.cookie('refreshToken', token.refreshToken, {httpOnly: true, secure: true})
            res.status(HTTP_STATUS.OK_200).json({accessToken: token.accessToken})
        } else {
            res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401)
        }
    })

    router.post('/password-recovery', rateLimitMiddleware, validationEmail, inputValidationMiddleware, async (req: Request, res: Response) => {
        const recoveryCode = await authService.sendRecoveryCode(req.body.email)
        // для моих тестов тут должно стоять OK_200
        res.status(HTTP_STATUS.NO_CONTENT_204).json({recoveryCode: recoveryCode})
    })

    router.post('/new-password', rateLimitMiddleware, validationPassAndCode, inputValidationMiddleware, async (req: ReqBodyType<PassCodeDTO>, res: Response) => {
        const verifyRecoveryCode = await authService.checkRecoveryCode(req.body.recoveryCode)
        if (!verifyRecoveryCode) {
            res.status(HTTP_STATUS.BAD_REQUEST_400).json({
                errorsMessages: [
                    {
                        message: 'recovery code is incorrect',
                        field: 'recoveryCode'
                    }
                ]
            })
        } else {
            await authService.updatePassword(req.body.recoveryCode, req.body.newPassword)
            res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
        }
    })

    router.post('/refresh-token', cookieMiddleware, async (req: Request, res: Response) => {
        const refreshTokenPayload = await jwtService.getPayloadByToken(req.cookies.refreshToken)
        const tokenIssuedAt = new Date(refreshTokenPayload.iat * 1000).toISOString()
        const lastActiveSession = await securityService.findActiveSessionByDeviceId(refreshTokenPayload.deviceId)

        if (tokenIssuedAt === lastActiveSession!.lastActiveDate) {
            const token = await jwtService.updateJWT(refreshTokenPayload.userId, refreshTokenPayload.deviceId)
            const newTokenPayload = await jwtService.getPayloadByToken(token.refreshToken)
            const lastActiveDate = new Date(newTokenPayload.iat * 1000).toISOString()
            await securityService.updateLastActiveDateByDeviceId(refreshTokenPayload.deviceId, lastActiveDate)

            res.cookie('refreshToken', token.refreshToken, {httpOnly: true, secure: true})
            res.status(HTTP_STATUS.OK_200).json({accessToken: token.accessToken})
        } else {
            res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401)
        }
    })

    router.post('/registration-confirmation', rateLimitMiddleware, async (req: Request, res: Response) => {
        // код приходит на почту, если он верный, то 204, иначе 400 и текст ошибки
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

    router.post('/registration', rateLimitMiddleware, validationReg, inputValidationMiddleware, async (req: ReqBodyType<UserRegDTO>, res: Response) => {
        // если входные данные для регистрции правильные, то создаем пользователя
        const existUserEmail = await usersService.findUserByLoginOrEmail(req.body.email)
        if (existUserEmail) {
            return res.status(HTTP_STATUS.BAD_REQUEST_400).json({
                errorsMessages: [
                    {
                        message: 'user with the given email already exists',
                        field: 'email'
                    }
                ]
            })
        }

        const existUserLogin = await usersService.findUserByLoginOrEmail(req.body.login)
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

    router.post('/registration-email-resending', rateLimitMiddleware, validationEmail, inputValidationMiddleware, async (req: Request, res: Response) => {
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
            await authService.updateConfirmationCode(req.body.email)
            res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
        }
    })

    router.post('/logout', cookieMiddleware, async (req: Request, res: Response) => {
        const refreshTokenPayload = await jwtService.getPayloadByToken(req.cookies.refreshToken)
        await securityService.deleteCurrentSessionByDeviceId(refreshTokenPayload.deviceId)
        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
    })

    router.get('/me', bearerAuthMiddleware, async (req: Request, res: Response) => {
        res.status(HTTP_STATUS.OK_200).json({
            email: req.user!.email,
            login: req.user!.login,
            userId: req.user!.id
        })
    })

    return router
}