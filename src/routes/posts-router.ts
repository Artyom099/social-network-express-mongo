import {body} from "express-validator";
import express, {Request, Response} from "express";
import {ReqParamsQueryType, IdDTO, PagingDTO, ReqQueryType, TPost, PostDTO, ReqBodyType} from "../types/types";
import {HTTP_STATUS} from "../utils/constants";
import {convertResultErrorCodeToHttp} from "../utils/utils";
import {postsService} from "../domain/posts-service";
import {BlogsService} from "../domain/blogs-service";
import {inputValidationMiddleware} from "../middleware/input-validation-middleware";
import {queryRepository} from "../repositories/query-repository";
import {feedbackService} from "../domain/feedbacks-service";
import {authMiddlewareBasic, authMiddlewareBearer} from "../middleware/auth-middleware";
import {DEFAULT_SORT_BY, DEFAULT_SORT_DIRECTION} from "../utils/constants";


const validationPost = [
    body('title').isString().isLength({min: 3, max: 30}).trim().not().isEmpty(),
    body('shortDescription').isString().isLength({min: 3, max: 100}).trim().notEmpty(),
    body('content').isString().isLength({min: 3, max: 1000}).trim().notEmpty(),
    body('blogId').isString().custom(async (value) => {
        const blog = await new BlogsService().findBlogById(value)
        if (!blog) {
            throw new Error('blog not found')
        }
        return true
    })]
export const validationComment = [
    body('content').isString().isLength({min: 20, max: 300}).trim().not().isEmpty()
]

export const postsRouter = () => {
    const router = express.Router()

    router.get('/:id/comments', async (req: ReqParamsQueryType<IdDTO, PagingDTO>, res: Response) => {
        const foundPost = await postsService.findPostById(req.params.id)
        if (!foundPost) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        } else {
            const pageNumber = req.query.pageNumber ?? 1
            const pageSize = req.query.pageSize ?? 10
            const sortBy = req.query.sortBy ?? DEFAULT_SORT_BY
            const sortDirection = req.query.sortDirection ?? DEFAULT_SORT_DIRECTION
            const foundSortedComments = await queryRepository.findCommentsThisPostAndSort(foundPost.id, Number(pageNumber), Number(pageSize), sortBy, sortDirection)
            res.status(HTTP_STATUS.OK_200).json(foundSortedComments)
        }
    })

    router.post('/:postId/comments', validationComment, authMiddlewareBearer, inputValidationMiddleware, async (req: Request, res: Response) => {
        const currentPost = await postsService.findPostById(req.params.postId)
        if (!currentPost) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        } else {
            const createdComment = await feedbackService.createComment(req.params.postId, req.body.content, req.user!.id, req.user!.login)
            res.status(HTTP_STATUS.CREATED_201).json(createdComment)
        }
    })

    router.get('/', async (req: ReqQueryType<PagingDTO>, res: Response) => {
        const pageNumber = req.query.pageNumber ?? 1
        const pageSize = req.query.pageSize ?? 10
        const sortBy = req.query.sortBy ?? DEFAULT_SORT_BY
        const sortDirection = req.query.sortDirection ?? DEFAULT_SORT_DIRECTION

        const foundSortedPosts = await queryRepository.findPostsAndSort(Number(pageNumber), Number(pageSize), sortBy, sortDirection)
        res.status(HTTP_STATUS.OK_200).json(foundSortedPosts)
    })

    router.post('/', validationPost, authMiddlewareBasic, inputValidationMiddleware, async (req: ReqBodyType<PostDTO>, res: Response) => {
        const {title, shortDescription, content, blogId} = req.body
        const blog = await new BlogsService().findBlogById(blogId)
        const createdPost = await postsService.createPost(title, shortDescription, content, blog)
        res.status(HTTP_STATUS.CREATED_201).json(createdPost)
    })

    router.get('/:id', async (req: Request, res: Response<TPost>) => {
        const foundPost = await postsService.findPostById(req.params.id)
        if (!foundPost) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        res.status(HTTP_STATUS.OK_200).json(foundPost)
    })

    router.put('/:id', validationPost, authMiddlewareBasic, inputValidationMiddleware, async (req: Request, res: Response) => {
        const {title, shortDescription, content} = req.body
        const result = await postsService.updatePostById(req.params.id, title, shortDescription, content)
        if (!result.data) {
            res.sendStatus(convertResultErrorCodeToHttp(result.code))
        } else {
            const updatedPost = await postsService.findPostById(req.params.id)
            res.status(HTTP_STATUS.NO_CONTENT_204).json(updatedPost)
        }
    })

    router.delete('/:id', authMiddlewareBasic, async (req: Request, res: Response) => {
        const postForDelete = await postsService.findPostById(req.params.id)
        if (!postForDelete) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        } else {
            await postsService.deletePostById(req.params.id)
            res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
        }
    })

    return router
}