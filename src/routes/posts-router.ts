import express, {Request, Response} from "express";
import {body} from "express-validator";
import {HTTP_STATUS} from "../utils";
import {RequestBodyType, TPost} from "../types";
import {postsRepository} from "../repositories/posts-repository";
import {blogsRepository} from "../repositories/blogs-repository";
import {authMiddleware, inputValidationMiddleware} from "../middleware/input-validation-middleware";


const validationPost = [
    body('title').isString().isLength({min: 3, max: 30}).trim().not().isEmpty(),
    body('shortDescription').isString().isLength({min: 3, max: 100}).trim().notEmpty(),
    body('content').isString().isLength({min: 3, max: 1000}).trim().notEmpty(),
    body('blogId').isString().custom((value) => {
        const blog = blogsRepository.findBlogById(value)
        if (!blog) {
            throw new Error('blog not found')
        }
        return true
    })]

export const getPostsRouter = () => {
    const router = express.Router()

    router.get('/', async (req: Request, res: Response) => {
        const foundPosts = await postsRepository.findExistPosts()
        res.status(HTTP_STATUS.OK_200).send(foundPosts)
    })
    router.post('/', validationPost, authMiddleware, inputValidationMiddleware,
        async (req: Request, res: Response) => {
            const {title, shortDescription, content, blogId} = req.body
            const blog = await blogsRepository.findBlogById(req.body.blogId)

            const createPost = await postsRepository.createPost(title, shortDescription, content, blogId, blog)
            res.status(HTTP_STATUS.CREATED_201).json(createPost)
        })

    router.get('/:id', async (req: Request, res: Response<TPost>) => {
        const findPost = await postsRepository.findPostById(req.params.id)
        if (!findPost) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)     // если не нашли блог по id, то выдаем ошибку и выходим из эндпоинта
        res.status(HTTP_STATUS.OK_200).json(findPost)
    })
    router.put('/:id', validationPost, authMiddleware, inputValidationMiddleware,
        async (req: Request, res: Response) => {
            const foundPost = await postsRepository.findPostById(req.params.id)
            if (!foundPost) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)    // если не нашли блог по id, выдаем ошибку и выходим из эндпоинта

            const {title, shortDescription, content} = req.body
            const updatedPost = await postsRepository.updatePost(foundPost, title, shortDescription, content)
            res.status(HTTP_STATUS.NO_CONTENT_204).json(updatedPost)
        })
    router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
        const postForDelete = postsRepository.findPostById(req.params.id)
        if (!postForDelete) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)

        await postsRepository.deletePostById(req.params.id)
        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
    })
    return router
}