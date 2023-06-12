import {body} from "express-validator";
import {Router} from "express";
import {BlogsService} from "../domain/blogs-service";
import {inputValidationMiddleware} from "../middleware/input-validation-middleware";
import {authMiddlewareBasic, authMiddlewareBearer} from "../middleware/auth-middleware";
import {BlogsRepository} from "../repositories/blogs-repository";
import {postsController} from "../composition-root";
import {checkUserIdMiddleware} from "../middleware/check-userid-middleware";
import {validationLikes} from "./feedback-router";

const validationPost = [
    body('title').isString().isLength({min: 3, max: 30}).trim().not().isEmpty(),
    body('shortDescription').isString().isLength({min: 3, max: 100}).trim().notEmpty(),
    body('content').isString().isLength({min: 3, max: 1000}).trim().notEmpty(),
    body('blogId').isString().custom(async (value) => {
        const blog = new BlogsService(new BlogsRepository)
        await blog.findBlogById(value)
        if (!blog) {
            throw new Error('blog not found')
        } else {
            return true
        }
    })]
export const validationComment = [
    body('content').isString().isLength({min: 20, max: 300}).trim().not().isEmpty()
]


export const postsRouter = Router({})

postsRouter.get('/',
    checkUserIdMiddleware,
    postsController.getPosts.bind(postsController))
postsRouter.post('/',
    validationPost,
    authMiddlewareBasic,
    inputValidationMiddleware,
    postsController.createPost.bind(postsController))

postsRouter.get('/:id',
    checkUserIdMiddleware,
    postsController.getPost.bind(postsController))
postsRouter.put('/:id',
    validationPost,
    authMiddlewareBasic,
    inputValidationMiddleware,
    postsController.updatePost.bind(postsController))
postsRouter.delete('/:id',
    authMiddlewareBasic,
    postsController.deletePost.bind(postsController))

postsRouter.get('/:id/comments',
    checkUserIdMiddleware,
    postsController.findCommentsCurrentPost.bind(postsController))
postsRouter.post('/:id/comments',
    validationComment,
    authMiddlewareBearer,
    inputValidationMiddleware,
    postsController.createCommentCurrentPost.bind(postsController))

postsRouter.put('/:id/like-status',
    authMiddlewareBearer,
    validationLikes,
    inputValidationMiddleware,
    postsController.updateLikeStatus.bind(postsController))