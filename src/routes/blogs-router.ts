import {body} from "express-validator";
import express, {Request, Response} from "express";
import {TBlog} from "../types";
import {HTTP_STATUS} from "../utils";
import {blogsRepository} from "../repositories/blogs-repository";
import {authMiddleware, inputValidationMiddleware} from "../middleware/input-validation-middleware";


const validationBlog = [
    body('name').isString().isLength({min: 3, max: 15}).trim().not().isEmpty(),
    body('description').isString().isLength({min: 3, max: 500}).trim().notEmpty(),
    body('websiteUrl').isURL().isLength({min: 4, max: 100})
]

export const getBlogsRouter = () => {
    const router = express.Router()

    router.get('/', async (req: express.Request, res: express.Response) => {
        const foundBlogs = await blogsRepository.findExistBlogs()
        res.status(HTTP_STATUS.OK_200).send(foundBlogs)
    })

    router.post('/', validationBlog, authMiddleware, inputValidationMiddleware,
    async (req: express.Request, res: express.Response) => {
        const {name, description, websiteUrl} = req.body
        const createBlog = await blogsRepository.createBlog(name, description, websiteUrl)
        res.status(HTTP_STATUS.CREATED_201).json(createBlog)
    })

    router.get('/:id', async (req: Request, res: Response<TBlog>) => {
        const findBlog = await blogsRepository.findBlogById(req.params.id)
        if (!findBlog) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)     // если не нашли блог по id, то выдаем ошибку и выходим из эндпоинта
        res.status(HTTP_STATUS.OK_200).json(findBlog)
    })

    router.put('/:id', validationBlog, authMiddleware, inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const foundBlog = await blogsRepository.findBlogById(req.params.id)
        if (!foundBlog) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)    // если не нашли блог по id, выдаем ошибку и выходим из эндпоинта

        const {name, description, websiteUrl} = req.body
        const updatedBlog = await blogsRepository.updateBlog(foundBlog, name, description, websiteUrl)
        res.status(HTTP_STATUS.NO_CONTENT_204).json(updatedBlog)
    })

    router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
        const blogForDelete = blogsRepository.findBlogById(req.params.id)
        if (!blogForDelete) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)    // если не нашли блог по id, то выдаем ошибку и выходим из эндпоинта

        await blogsRepository.deleteBlogById(req.params.id)                     // эта строка удаляет найденный блог из бд
        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
    })
    return router
}