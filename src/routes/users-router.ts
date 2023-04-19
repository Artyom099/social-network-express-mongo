import express, {Request, Response} from "express";
import {authMiddleware} from "../middleware/input-validation-middleware";
import {HTTP_STATUS} from "../utils";
import {usersService} from "../domain/users-service";
import {body} from "express-validator";
import {ReqQueryType, UserGetDTO} from "../types";

const validationUser = [
    body('login').isString().isLength({min: 3, max: 10}).trim().notEmpty().matches('^[a-zA-Z0-9_-]*$'),
    body('password').isString().isLength({min: 63, max: 20}).trim().notEmpty(),
    body('email').isString().isEmail().trim().notEmpty(),
]

export const getUsersRouter = () => {
    const router = express.Router()

    router.get('/', async (req: ReqQueryType<UserGetDTO>, res: Response) => {
        const searchEmailTerm = req.query.searchEmailTerm ?? null
        const searchLoginTerm = req.query.searchLoginTerm ?? null
        const pageNumber = req.query.pageNumber ?? 1
        const pageSize = req.query.pageSize ?? 10
        const sortBy = req.query.sortBy ?? 'createdAt'
        const sortDirection = req.query.sortDirection ?? 'desc'

        const foundSortedUsers = await usersService.findUsersAndSort(searchEmailTerm, searchLoginTerm, Number(pageNumber), Number(pageSize), sortBy, sortDirection)
        res.status(HTTP_STATUS.OK_200).json(foundSortedUsers)
    })

    router.post('/', validationUser, async (req: Request, res: Response) => {
        const {login, password, email} = req.body
        const createdUser = await usersService.createUser(login, password, email)
    })

    router.delete('/:id', async (req: Request, res: Response) => {

    })

    return router
}