import {Router} from "express"
import {LikeStatus} from "../../../infrastructure/utils/enums";
import {validationComment} from "../../post/api/posts-router";
import {body} from "express-validator";
import {commentsController} from "../../../composition-root";
import { userIdMiddleware } from "../../../infrastructure/middleware/user-id-middleware";
import {bearerAuthMiddleware} from '../../../infrastructure/middleware/auth-middleware';
import {inputValidationMiddleware} from '../../../infrastructure/middleware/input-validation-middleware';


const validationLike = body('likeStatus').isString().trim().notEmpty()
    .custom(async (value) => {
        const correctStatuses = Object.values(LikeStatus)
        if (!correctStatuses.includes(value)) {
            throw new Error('incorrect like status')
        } else {
            return true
        }
    })


export const commentsRouter = Router({})

commentsRouter.get('/:id',
    userIdMiddleware,
    commentsController.getComment.bind(commentsController))

commentsRouter.put('/:commentId',
    validationComment,
    bearerAuthMiddleware,
    inputValidationMiddleware,
    commentsController.updateComment.bind(commentsController))

commentsRouter.delete('/:commentId',
    bearerAuthMiddleware,
    commentsController.deleteComment.bind(commentsController))

commentsRouter.put('/:commentId/like-status',
    bearerAuthMiddleware,
    validationLike,
    inputValidationMiddleware,
    commentsController.updateLikeStatus.bind(commentsController))