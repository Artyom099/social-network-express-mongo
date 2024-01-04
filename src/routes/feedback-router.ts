import {Router} from "express"
import {LikeStatus} from "../utils/constants";
import {authMiddlewareBearer} from "../middleware/auth-middleware";
import {validationComment} from "./posts-router";
import {inputValidationMiddleware} from "../middleware/input-validation-middleware";
import {body} from "express-validator";
import {feedbackController} from "../composition-root";
import { checkUserIdMiddleware } from "../infrastructure/middleware/check-userid-middleware";


const validationLike = body('likeStatus').isString().trim().notEmpty()
    .custom(async (value) => {
        const correctStatuses = Object.values(LikeStatus)
        if (!correctStatuses.includes(value)) {
            throw new Error('incorrect like status')
        } else {
            return true
        }
    })


export const feedbackRouter = Router({})

feedbackRouter.get('/:id',
    checkUserIdMiddleware,
    feedbackController.getComment.bind(feedbackController))

feedbackRouter.put('/:commentId',
    validationComment,
    authMiddlewareBearer,
    inputValidationMiddleware,
    feedbackController.updateComment.bind(feedbackController))

feedbackRouter.delete('/:commentId',
    authMiddlewareBearer,
    feedbackController.deleteComment.bind(feedbackController))

feedbackRouter.put('/:commentId/like-status',
    authMiddlewareBearer,
    validationLike,
    inputValidationMiddleware,
    feedbackController.updateLikeStatus.bind(feedbackController))