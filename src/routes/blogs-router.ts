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
            id: dateNow.toISOString(),  //TODO как првильно генерить id, чтобы приходила строка, а не число
            name,
            description,
            websiteUrl
        }

        const createBlog = blogsRepository.createBlog(createdBlog)
        res.status(HTTP_STATUS.CREATED_201).json(createBlog)
    })
    router.get('/:id', (req: Request, res: Response) => {
        // const foundBlog = db.blogs.find(b => b.id === req.params.id)
        const blogId = req.params.id
        const findBlog = blogsRepository.findBlogById(blogId)

        // если не нашли блог по id, то выдаем ошибку и выходим из эндпоинта
        if (!findBlog) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)

        // иначе возвращаем найденный блог
        res.status(HTTP_STATUS.OK_200).json(findBlog)

    })  //TODO добавить типизацию на Response
    router.put('/:id', nameValidation, descriptionValidation, websiteUrlValidation,inputValidationMiddleware,
        (req: Request, res: Response) => {

        // если не нашли блог по id, выдаем ошибку и выходим из эндпоинта
        const foundBlog = db.blogs.find(b => b.id === req.params.id)
        // const blogId = req.params.id
        // const findBlog = blogsRepository.findBlogById(blogId)

        if (!foundBlog) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)

        const {name, description, websiteUrl} = req.body
        foundBlog.name = name
        foundBlog.description = description
        foundBlog.websiteUrl = websiteUrl

        const updateBlog = blogsRepository.updateBlog(foundBlog)
        res.status(HTTP_STATUS.NO_CONTENT_204).json(updateBlog)
    })
    router.delete('/:id', (req: Request, res: Response) => {
        // если не нашли блог по id, то сразу выдаем ошибку not found и выходим из эндпоинта
        const videoForDelete = db.videos.find(v => v.id === +req.params.id)         // TODO можно сделать через findIndex + split?
        if (!videoForDelete) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)

        db.videos = db.videos.filter(vid => vid.id !== +req.params.id)
        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
    })
    return router
}