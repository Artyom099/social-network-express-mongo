import {body} from "express-validator";
import express, {Request, Response} from "express";
import {TBlog} from "../types";
import {HTTP_STATUS} from "../utils";
import {blogsRepository} from "../repositories/blogs-repository";
import {authMiddleware, inputValidationMiddleware} from "../middleware/input-validation-middleware";


const nameValidation = body('name').isString().isLength({min: 3, max: 15}).trim().not().isEmpty()
const descriptionValidation = body('description').isString().isLength({min: 3, max: 500}).trim().notEmpty()

const regex = new RegExp('^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$')
const websiteUrlValidation = body('websiteUrl').isURL().isLength({min: 4, max: 100})  // .isURL()
    // .custom((value) => {
    //     if (!regex.test(value)) {
    //         throw new Error('incorrect websiteUrl')
    //     } else {
    //         return true
    //     }
    // })


export const getBlogsRouter = () => {
    const router = express.Router()
    router.get('/', (req: express.Request, res: express.Response) => {
        const foundBlogs = blogsRepository.findExistBlogs()
        res.status(HTTP_STATUS.OK_200).send(foundBlogs)
    })
    router.post('/',
        authMiddleware,
        nameValidation,
        descriptionValidation,
        websiteUrlValidation,
        inputValidationMiddleware,
        // authMiddleware,
    (req: express.Request, res: express.Response) => {
        const {name, description, websiteUrl} = req.body
        const createBlog = blogsRepository.createBlog(name, description, websiteUrl)
        res.status(HTTP_STATUS.CREATED_201).json(createBlog)
    })
    router.get('/:id', (req: Request, res: Response<TBlog>) => {
        const findBlog = blogsRepository.findBlogById(req.params.id)
        if (!findBlog) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)     // если не нашли блог по id, то выдаем ошибку и выходим из эндпоинта
        res.status(HTTP_STATUS.OK_200).json(findBlog)
    })
    router.put('/:id',
        authMiddleware,
        nameValidation,
        descriptionValidation,
        websiteUrlValidation,
        inputValidationMiddleware,
        // authMiddleware,
    (req: Request, res: Response) => {
        const foundBlog = blogsRepository.findBlogById(req.params.id)
        if (!foundBlog) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)    // если не нашли блог по id, выдаем ошибку и выходим из эндпоинта

        const {name, description, websiteUrl} = req.body
        const updatedBlog = blogsRepository.updateBlog(foundBlog, name, description, websiteUrl)
        res.status(HTTP_STATUS.NO_CONTENT_204).json(updatedBlog)
    })
    router.delete('/:id', authMiddleware, (req: Request, res: Response) => {
        const blogForDelete = blogsRepository.findBlogById(req.params.id)
        if (!blogForDelete) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)    // если не нашли блог по id, то выдаем ошибку и выходим из эндпоинта

        blogsRepository.deleteBlogById(req.params.id)                           // эта строка удаляет найденный блог из бд
        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
    })
    return router
}