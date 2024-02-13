import express, {Request, Response} from "express"
import {HTTP_STATUS, SortBy, SortDirection} from "../../../infrastructure/utils/enums";
import {usersService} from "../application/users-service"
import {body} from "express-validator"
import {ReqQueryType, UserGetDTO} from "../../../infrastructure/types/types"
import {basicAuthMiddleware} from '../../../infrastructure/middleware/auth-middleware';
import {inputValidationMiddleware} from '../../../infrastructure/middleware/input-validation-middleware';
import {UserQueryRepository} from '../infrastructure/user.query.repository';

const validationUser = [
    body('login').isString().isLength({min: 3, max: 10}).trim().notEmpty().matches('^[a-zA-Z0-9_-]*$'),
    body('password').isString().isLength({min: 6, max: 20}).trim().notEmpty(),
    body('email').isString().isEmail().trim().notEmpty(),
]

export const usersRouter = () => {
    const router = express.Router()

    router.get('/', basicAuthMiddleware, async (req: ReqQueryType<UserGetDTO>, res: Response) => {
        //TODO попробовать реализовать как ф-ю
        const searchEmailTerm = req.query.searchEmailTerm ?? null
        const searchLoginTerm = req.query.searchLoginTerm ?? null
        const pageNumber = req.query.pageNumber ?? 1
        const pageSize = req.query.pageSize ?? 10
        const sortBy = req.query.sortBy ?? SortBy.default
        const sortDirection = req.query.sortDirection ?? SortDirection.default

        const users = await UserQueryRepository.getSortedUsers(searchEmailTerm, searchLoginTerm,
            Number(pageNumber), Number(pageSize), sortBy, sortDirection)

        res.status(HTTP_STATUS.OK_200).json(users)
    })

    router.post('/', validationUser, basicAuthMiddleware, inputValidationMiddleware, async (req: Request, res: Response) => {
        const {login, password, email} = req.body

        const user = await usersService.createUser(login, password, email)
        res.status(HTTP_STATUS.CREATED_201).json(user)
    })

    router.delete('/:id', basicAuthMiddleware, async (req: Request, res: Response) => {
        const user = await usersService.findUserById(req.params.id)

        if (!user) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        } else {
            await usersService.deleteUserById(req.params.id)
            res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
        }
    })

    return router
}