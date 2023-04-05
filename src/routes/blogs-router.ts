import {
    RequestBodyType, RequestParamsBodyType,
    RequestParamsType,
    TBadRequestError,
    TDataBase,
    TBlog,
    VideoIdDTO,
    VideoPostDTO, VideoPutDTO
} from "../types";
import express, {Request, Response} from "express";
import {HTTP_STATUS} from "../utils";
import {body, validationResult} from "express-validator";
import {blogsRepository} from "../repositories/blogs-repository";
import {inputValidationMiddleware} from "../middleware/input-validation-middleware";


const titleValidation = body('name').isString().isLength({min: 3, max: 15})
const descriptionValidation = body('description').isString().isLength({min: 3, max: 500})
const websiteUrlValidation = body('websiteUrl').isURL().isLength({min: 8, max: 100})
// TODO добавитьвалидацию согласно шаблону: ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$

export const getBlogsRouter = (db: TDataBase) => {
    const router = express.Router()
    router.get('/', (req: express.Request, res: express.Response) => {
        const foundBlogs = blogsRepository.findBlogs()
        res.status(HTTP_STATUS.OK_200).send(foundBlogs)
    })
    router.post('/',
        titleValidation, descriptionValidation, websiteUrlValidation, inputValidationMiddleware,
        (req: express.Request, res: express.Response) => {
        //RequestBodyType<VideoPostDTO>

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

        // если не нашли видео по id, то сразу выдаем ошибку not found и выходим из эндпоинта
        const foundBlog = db.blogs.find(b => b.id === req.params.id)
        if (!foundBlog) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)

        // иначе возвращаем найденное видео
        const findBlog = blogsRepository.findOneBlog()
        res.status(HTTP_STATUS.OK_200).json(foundBlog)

    })  //TODO добавить типизацию на Response
    router.put('/:id', titleValidation, descriptionValidation, websiteUrlValidation,inputValidationMiddleware,
        (req: Request, res: Response) => {

        // если не нашли видео по id, сразу выдаем ошибку not found и выходим из эндпоинта
        const foundBlog = db.blogs.find(b => b.id === req.params.id)
        if (!foundBlog) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)

        const {name, description, websiteUrl} = req.body

        foundBlog.name = name
        foundBlog.description = description
        foundBlog.websiteUrl = websiteUrl
        const updateBlog = blogsRepository.updateBlog(foundBlog)
        res.status(HTTP_STATUS.NO_CONTENT_204).json(updateBlog)
    })
    router.delete('/:id', (req: RequestParamsType<VideoIdDTO>, res: Response) => {
        // если не нашли видео по id, то сразу выдаем ошибку not found и выходим из эндпоинта
        const videoForDelete = db.videos.find(v => v.id === +req.params.id)         // TODO можно сделать через findIndex + split?
        if (!videoForDelete) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)

        db.videos = db.videos.filter(vid => vid.id !== +req.params.id)
        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
    })
    return router
}