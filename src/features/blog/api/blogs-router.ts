import {body} from "express-validator";
import {Router} from "express";
import {blogsController} from "../../../composition-root";
import {basicAuthMiddleware} from '../../../infrastructure/middleware/auth-middleware';
import {inputValidationMiddleware} from '../../../infrastructure/middleware/input-validation-middleware';
import {userIdMiddleware} from '../../../infrastructure/middleware/user-id-middleware';

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


export const blogsRouter = Router({})

blogsRouter.get('/', blogsController.getBlogs.bind(blogsController))

blogsRouter.post('/',
    validationBlog,
    basicAuthMiddleware,
    inputValidationMiddleware,
    blogsController.createBlog.bind(blogsController))

blogsRouter.get('/:id/posts',
    userIdMiddleware,
    blogsController.getPostCurrentBlog.bind(blogsController))

blogsRouter.post('/:id/posts',
    validationPost,
    basicAuthMiddleware,
    inputValidationMiddleware,
    blogsController.createPostCurrentBlog.bind(blogsController))

blogsRouter.get('/:id', blogsController.getBlog.bind(blogsController))

blogsRouter.put('/:id',
    validationBlog,
    basicAuthMiddleware,
    inputValidationMiddleware,
    blogsController.updateBlog.bind(blogsController))

blogsRouter.delete('/:id',
    basicAuthMiddleware,
    blogsController.deleteBlog.bind(blogsController))