import {Router} from "express"
import {LikeStatus} from "../utils/constants";
import {authMiddlewareBearer} from "../middleware/auth-middleware";
import {validationComment} from "./posts-router";
import {inputValidationMiddleware} from "../middleware/input-validation-middleware";
import {body} from "express-validator";
import {feedbackController} from "../composition-root";
import {cookieMiddleware} from "../middleware/cookie-middleware";

const validationLikes = body('likeStatus').isString().trim().notEmpty().toLowerCase()
    .custom(async (value) => {
        const correctStatuses = Object.values(LikeStatus)
        if (!correctStatuses.includes(value)) {
            throw new Error('incorrect like status')
        } else {
            return true
        }
    })


export const feedbackRouter = Router({})

feedbackRouter.get('/:id', feedbackController.getComment.bind(feedbackController))

feedbackRouter.put('/:commentId',
    validationComment,
    // cookieMiddleware,
    authMiddlewareBearer,
    inputValidationMiddleware,
    feedbackController.updateComment.bind(feedbackController))

feedbackRouter.delete('/:commentId',
    // cookieMiddleware,
    authMiddlewareBearer,
    feedbackController.deleteComment.bind(feedbackController))

feedbackRouter.put('/:commentId/likes-status',
    cookieMiddleware,
    validationLikes,
    // authMiddlewareBearer,
    inputValidationMiddleware,
    feedbackController.updateLikeStatus.bind(feedbackController))