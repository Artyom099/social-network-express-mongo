import {body} from "express-validator";
import {Router} from "express";
import {inputValidationMiddleware} from "../middleware/input-validation-middleware";
import {authMiddlewareBasic} from "../middleware/auth-middleware"
import {blogsController} from "../composition-root";


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
    authMiddlewareBasic,
    inputValidationMiddleware,
    blogsController.createBlog.bind(blogsController))

blogsRouter.get('/:id/posts', blogsController.getPostCurrentBlog.bind(blogsController))
blogsRouter.post('/:id/posts',
    validationPost,
    authMiddlewareBasic,
    inputValidationMiddleware,
    blogsController.createPostCurrentBlog.bind(blogsController))

blogsRouter.get('/:id', blogsController.getBlog.bind(blogsController))
blogsRouter.put('/:id',
    validationBlog,
    authMiddlewareBasic,
    inputValidationMiddleware,
    blogsController.updateBlog.bind(blogsController))
blogsRouter.delete('/:id', authMiddlewareBasic, blogsController.deleteBlog.bind(blogsController))