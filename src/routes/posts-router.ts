import express from "express";
import {body} from "express-validator";
import {TDataBase, TPost} from "../types";
import {HTTP_STATUS} from "../utils";
import {postsRepository} from "../repositories/posts-repository";
import {inputValidationMiddleware} from "../middleware/input-validation-middleware";


const titleValidation = body('title').isString().isLength({min: 3, max: 30})
const shortDescriptionValidation = body('shortDescription').isString().isLength({min: 10, max: 100})
const contentValidation = body('content').isString().isLength({min: 20, max: 1000})
const blogIdValidation = body('blogId').isString()

export const getPostsRouter = (db: TDataBase) => {
    const router = express.Router()
    router.get('/', (req: express.Request, res: express.Response) => {
        const foundPosts = postsRepository.findExistPosts()
        res.status(HTTP_STATUS.OK_200).send(foundPosts)
    })

    router.post('/',
    titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, inputValidationMiddleware,
    (req: express.Request, res: express.Response) => {

        // TODO сюда добавить проверку наличия blogId
        const {title, shortDescription, content, blogId} = req.body
        const dateNow = new Date()
        const createdPost: TPost = {
            id: dateNow.toISOString(),  //TODO как првильно генерить id, чтобы приходила строка, а не число
            title,
            shortDescription,
            content,
            blogId,
            blogName: 'Откуча мы получаем имя блога?'   // todo найти, что сюда поставить
        }

        const createPost = postsRepository.createPost(createdPost)
        res.status(HTTP_STATUS.CREATED_201).json(createPost)
    })

    return router
}