import express, {Response} from "express"
import {HTTP_STATUS} from "../utils/constants";
import {feedbackService} from "../domain/feedbacks-service"
import {authMiddlewareBearer} from "../middleware/auth-middleware";
import {validationComment} from "./posts-router";
import {inputValidationMiddleware} from "../middleware/input-validation-middleware";
import {IdDTO, ReqParamsBodyType, ReqParamsType} from "../types/types";


export const feedbackRouter = () => {
    const router = express.Router()

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