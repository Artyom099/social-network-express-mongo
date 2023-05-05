import express, {Request, Response} from "express"
import {inputValidationMiddleware} from "../middleware/input-validation-middleware"
import {HTTP_STATUS} from "../utils"
import {usersService} from "../domain/users-service"
import {body} from "express-validator"
import {ReqQueryType, UserGetDTO} from "../types/types"
import {queryRepository} from "../repositories/query-repository"
import {authMiddlewareBasic} from "../middleware/auth-middleware";
import {DEFAULT_SORT_BY, DEFAULT_SORT_DIRECTION} from "../types/constants";

const validationUser = [
    body('login').isString().isLength({min: 3, max: 10}).trim().notEmpty().matches('^[a-zA-Z0-9_-]*$'),
    body('password').isString().isLength({min: 6, max: 20}).trim().notEmpty(),
    body('email').isString().isEmail().trim().notEmpty(),
]

export const getUsersRouter = () => {
    const router = express.Router()

    router.get('/', authMiddlewareBasic, async (req: ReqQueryType<UserGetDTO>, res: Response) => {
        //TODO попробовать реализовать как ф-ю
        const searchEmailTerm = req.query.searchEmailTerm ?? null
        const searchLoginTerm = req.query.searchLoginTerm ?? null
        const pageNumber = req.query.pageNumber ?? 1
        const pageSize = req.query.pageSize ?? 10
        const sortBy = req.query.sortBy ?? DEFAULT_SORT_BY
        const sortDirection = req.query.sortDirection ?? DEFAULT_SORT_DIRECTION

        const foundSortedUsers = await queryRepository.findUsersAndSort(searchEmailTerm, searchLoginTerm,
            Number(pageNumber), Number(pageSize), sortBy, sortDirection)
        res.status(HTTP_STATUS.OK_200).json(foundSortedUsers)
    })

    router.post('/', validationUser, authMiddlewareBasic, inputValidationMiddleware,
        async (req: Request, res: Response) => {
        const {login, password, email} = req.body
        const createdUser = await usersService.createUser(login, password, email)
        res.status(HTTP_STATUS.CREATED_201).json(createdUser)
    })

    router.delete('/:id', authMiddlewareBasic, async (req: Request, res: Response) => {
        const userForDelete = await usersService.findUserById(req.params.id)
        if (!userForDelete) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        await usersService.deleteUserById(req.params.id)
        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
    })

    return router
}