import {body} from "express-validator";
import express, {Request, Response} from "express";
import {HTTP_STATUS} from "../utils";
import {TDataBase, TBlog} from "../types";
import {blogsRepository} from "../repositories/blogs-repository";
import {inputValidationMiddleware} from "../middleware/input-validation-middleware";


const nameValidation = body('name').isString().isLength({min: 3, max: 15})
const descriptionValidation = body('description').isString().isLength({min: 3, max: 500})
const websiteUrlValidation = body('websiteUrl').isURL().isLength({min: 8, max: 100})
// TODO добавить валидацию согласно шаблону: ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$

export const getBlogsRouter = (db: TDataBase) => {
    const router = express.Router()
    router.get('/', (req: express.Request, res: express.Response) => {
        const foundBlogs = blogsRepository.findExistBlogs()
        res.status(HTTP_STATUS.OK_200).send(foundBlogs)
    })
    router.post('/', nameValidation, descriptionValidation, websiteUrlValidation, inputValidationMiddleware,
        (req: express.Request, res: express.Response) => {

        const {name, description, websiteUrl} = req.body
        const dateNow = new Date()
        const createdBlog: TBlog = {
            id: (+dateNow).toString(),
            name,
            description,
            websiteUrl
        }

        const createBlog = blogsRepository.createBlog(createdBlog)
        res.status(HTTP_STATUS.CREATED_201).json(createBlog)
    })
    router.get('/:id', (req: Request, res: Response) => {
        // const foundBlog = db.blogs.find(b => b.id === req.params.id)
        const findBlog = blogsRepository.findBlogById(req.params.id)
        if (!findBlog) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)     // если не нашли блог по id, то выдаем ошибку и выходим из эндпоинта
        res.status(HTTP_STATUS.OK_200).json(findBlog)
    })  //TODO добавить типизацию на Response !
    router.put('/:id', nameValidation, descriptionValidation, websiteUrlValidation,inputValidationMiddleware,
        (req: Request, res: Response) => {
        // const foundBlog = db.blogs.find(b => b.id === req.params.id)
        const foundBlog = blogsRepository.findBlogById(req.params.id)
        if (!foundBlog) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)    // если не нашли блог по id, выдаем ошибку и выходим из эндпоинта

        const {name, description, websiteUrl} = req.body
        const updatedBlog = blogsRepository.updateBlog(foundBlog, name, description, websiteUrl)
        res.status(HTTP_STATUS.NO_CONTENT_204).json(updatedBlog)
    })
    router.delete('/:id', (req: Request, res: Response) => {
        // можно сделать через findIndex + split
        // const idBlogForDelete = db.videos.findIndex(b => b.id === req.params.id)

        const blogForDelete = blogsRepository.findBlogById(req.params.id)
        if (!blogForDelete) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)    // если не нашли блог по id, то выдаем ошибку и выходим из эндпоинта

        blogsRepository.deleteBlogById(req.params.id)                           // эта строка удаляет найденный блог из бд
        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
    })
    return router
}