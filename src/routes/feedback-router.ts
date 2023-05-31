import express, {Request, Response} from "express"
import {HTTP_STATUS} from "../utils/constants";
import {feedbackService} from "../domain/feedbacks-service"
import {authMiddlewareBearer} from "../middleware/auth-middleware";
import {validationComment} from "./posts-router";
import {inputValidationMiddleware} from "../middleware/input-validation-middleware";
import {IdDTO, ReqParamsBodyType, ReqParamsType} from "../types/types";
import {body} from "express-validator";

const validationLikes = body('likeStatus').isString().trim().notEmpty()
// String({'None' : 'Like' , 'Dislike'})

export const feedbackRouter = () => {
    const router = express.Router()

    router.put('/:commentId/likes-status', validationLikes, authMiddlewareBearer, inputValidationMiddleware,
        async (req: Request, res: Response) => {
        const likedComment = await feedbackService.updateCommentLikes(req.params.commentId, req.body.likeStatus)
        if (!likedComment) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        } else {
            res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
        }
    })

    router.put('/:commentId', validationComment, authMiddlewareBearer, inputValidationMiddleware,
        async (req: ReqParamsBodyType<{commentId: string}, {content: string}>, res: Response) => {
        const foundComment = await feedbackService.findCommentById(req.params.commentId)
        if (!foundComment) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        }
        if (req.user!.id !== foundComment!.commentatorInfo.userId) {
            res.sendStatus(HTTP_STATUS.FORBIDDEN_403)
        }
        const updatedComment = await feedbackService.updateCommentById(req.params.commentId, req.body.content)
        if (!updatedComment) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        } else {
            res.status(HTTP_STATUS.NO_CONTENT_204).json(updatedComment)
        }
    })

    router.delete('/:commentId', authMiddlewareBearer, async (req: ReqParamsType<{commentId: string}>, res: Response) => {
        const foundComment = await feedbackService.findCommentById(req.params.commentId)
        if (!foundComment) {
            return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        }
        if (req.user!.id !== foundComment!.commentatorInfo.userId) {
            res.sendStatus(HTTP_STATUS.FORBIDDEN_403)
        } else {
            await feedbackService.deleteCommentById(req.params.commentId)
            res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
        }
    })

    router.get('/:id', async (req: ReqParamsType<IdDTO>, res: Response) => {
        const foundComment = await feedbackService.findCommentById(req.params.id)
        if (!foundComment) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        } else {
            res.status(HTTP_STATUS.OK_200).json(foundComment)
        }
    })

    return router
}