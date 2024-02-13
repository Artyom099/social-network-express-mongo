import {body} from "express-validator";
import {Router} from "express";
import {BlogsService} from "../../blog/application/blogs-service";

import {LikeStatus} from "../../../infrastructure/utils/enums";
import {BlogsRepository} from '../../blog/infrastructure/blogs-repository';
import {userIdMiddleware} from '../../../infrastructure/middleware/user-id-middleware';
import {postsController} from '../../../composition-root';
import {basicAuthMiddleware, bearerAuthMiddleware} from '../../../infrastructure/middleware/auth-middleware';
import {inputValidationMiddleware} from '../../../infrastructure/middleware/input-validation-middleware';

const validationPost = [
    body('title').isString().isLength({min: 3, max: 30}).trim().not().isEmpty(),
    body('shortDescription').isString().isLength({min: 3, max: 100}).trim().notEmpty(),
    body('content').isString().isLength({min: 3, max: 1000}).trim().notEmpty(),
    body('blogId').isString().custom(async (value) => {
        const blog = new BlogsService(new BlogsRepository)
        await blog.getBlogById(value)
        if (!blog) {
            throw new Error('blog not found')
        } else {
            return true
        }
    })]

export const validationComment = [
    body('content').isString().isLength({min: 20, max: 300}).trim().not().isEmpty()
]

const validationLike = body('likeStatus').isString().trim().notEmpty()
    .custom(async (value) => {
        const correctStatuses = Object.values(LikeStatus)
        if (!correctStatuses.includes(value)) {
            throw new Error('incorrect like status')
        } else {
            return true
        }
})


export const postsRouter = Router({})

postsRouter.get('/',
    userIdMiddleware,
    postsController.getPosts.bind(postsController))

postsRouter.post('/',
    validationPost,
    basicAuthMiddleware,
    inputValidationMiddleware,
    postsController.createPost.bind(postsController))

postsRouter.get('/:id',
    userIdMiddleware,
    postsController.getPost.bind(postsController))

postsRouter.put('/:id',
    validationPost,
    basicAuthMiddleware,
    inputValidationMiddleware,
    postsController.updatePost.bind(postsController))

postsRouter.delete('/:id',
    basicAuthMiddleware,
    postsController.deletePost.bind(postsController))

postsRouter.get('/:id/comments',
    userIdMiddleware,
    postsController.findCommentsCurrentPost.bind(postsController))

postsRouter.post('/:id/comments',
    validationComment,
    bearerAuthMiddleware,
    inputValidationMiddleware,
    postsController.createCommentCurrentPost.bind(postsController))

postsRouter.put('/:id/like-status',
    bearerAuthMiddleware,
    validationLike,
    inputValidationMiddleware,
    postsController.updateLikeStatus.bind(postsController))