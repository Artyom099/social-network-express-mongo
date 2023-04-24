import {body} from "express-validator";
import express, {Request, Response} from "express";
import {
    BlogPostDTO, BlogPutDTO,
    IdDTO, PagingDTO, PagingWithSearchDTO,
    ReqParamsBodyType,
    ReqParamsQueryType,
    ReqQueryType,
    TBlog
} from "../types";
import {convertResultErrorCodeToHttp, HTTP_STATUS} from "../utils";
import {blogsService} from "../domain/blogs-service";
import {postsService} from "../domain/posts-service";
import {inputValidationMiddleware} from "../middleware/input-validation-middleware";
import {queryRepository} from "../repositories/query-repository";
import {authMiddleware} from "../middleware/auth-middleware"


const validationBlog = [
    body('name').isString().isLength({min: 3, max: 15}).trim().not().isEmpty(),
    body('description').isString().isLength({min: 3, max: 500}).trim().notEmpty(),
    body('websiteUrl').isURL().isLength({min: 4, max: 100})
]
const validationPost = [
    body('title').isString().isLength({min: 3, max: 30}).trim().not().isEmpty(),
    body('shortDescription').isString().isLength({min: 3, max: 100}).trim().notEmpty(),
    body('content').isString().isLength({min: 3, max: 1000}).trim().notEmpty()
]

export const getBlogsRouter = () => {
    const router = express.Router()

    router.get('/', async (req: ReqQueryType<PagingWithSearchDTO>, res: Response) => {
        const searchNameTerm = req.query.searchNameTerm ?? null
        const pageNumber = req.query.pageNumber ?? 1
        const pageSize = req.query.pageSize ?? 10
        const sortBy = req.query.sortBy ?? 'createdAt'
        const sortDirection = req.query.sortDirection ?? 'desc'

        const foundSortedBlogs = await queryRepository.findBlogsAndSort(searchNameTerm, Number(pageNumber), Number(pageSize), sortBy, sortDirection)
        res.status(HTTP_STATUS.OK_200).json(foundSortedBlogs)
    })

    router.post('/', validationBlog, authMiddleware, inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const {name, description, websiteUrl} = req.body
        const createdBlog = await blogsService.createBlog(name, description, websiteUrl)
        res.status(HTTP_STATUS.CREATED_201).json(createdBlog)
    })

    router.get('/:id/posts', async (req: ReqParamsQueryType<IdDTO, PagingDTO>, res: Response) => {
        const findBlog = await queryRepository.findBlogById(req.params.id)
        if (!findBlog) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)

        const pageNumber = req.query.pageNumber ?? 1
        const pageSize = req.query.pageSize ?? 10
        const sortBy = req.query.sortBy ?? 'createdAt'
        const sortDirection = req.query.sortDirection ?? 'desc'

        const postsThisBlog = await queryRepository.findPostsThisBlogById(findBlog.id, Number(pageNumber), Number(pageSize), sortBy, sortDirection)
        res.status(HTTP_STATUS.OK_200).json(postsThisBlog)
    })

    router.post('/:id/posts', validationPost, authMiddleware, inputValidationMiddleware,
    async (req: ReqParamsBodyType<IdDTO, BlogPostDTO>, res: Response) => {
        const findBlog = await blogsService.findBlogById(req.params.id)
        if (!findBlog) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)

        const {title, shortDescription, content} = req.body
        const createdPostThisBlog = await postsService.createPost(title, shortDescription, content, findBlog)
        res.status(HTTP_STATUS.CREATED_201).json(createdPostThisBlog)
    })

    router.get('/:id', async (req: Request, res: Response<TBlog>) => {
        const findBlog = await blogsService.findBlogById(req.params.id)
        if (!findBlog) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)     // если не нашли блог по id, то выдаем ошибку и выходим из эндпоинта
        res.status(HTTP_STATUS.OK_200).json(findBlog)
    })

    router.put('/:id', validationBlog, authMiddleware, inputValidationMiddleware,
    async (req: ReqParamsBodyType<IdDTO, BlogPutDTO>, res: Response) => {
        const {name, description, websiteUrl} = req.body
        const result = await blogsService.updateBlogById(req.params.id, name, description, websiteUrl)

        if (!result.data) return res.sendStatus(convertResultErrorCodeToHttp(result.code))

        const updatedBlog = await blogsService.findBlogById(req.params.id)
        res.status(HTTP_STATUS.NO_CONTENT_204).json(updatedBlog)
    })

    router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
        const blogForDelete = await blogsService.findBlogById(req.params.id)
        if (!blogForDelete) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)    // если не нашли блог по id, то выдаем ошибку и выходим из эндпоинта

        await blogsService.deleteBlogById(req.params.id)                        // эта строка удаляет найденный блог из бд
        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
    })

    return router
}