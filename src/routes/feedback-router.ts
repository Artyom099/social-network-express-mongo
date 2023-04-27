import express, {Request, Response} from "express"
import {convertResultErrorCodeToHttp, HTTP_STATUS} from "../utils"
import {feedbackService} from "../domain/feedbacks-service"
import {authMiddlewareBearer} from "../middleware/auth-middleware";
import {validationComment} from "./posts-router";
import {inputValidationMiddleware} from "../middleware/input-validation-middleware";


export const feedbackRouter = () => {
    const router = express.Router()

    router.put('/:commentId', validationComment, authMiddlewareBearer, inputValidationMiddleware, async (req: Request, res: Response) => {
        const foundComment = await feedbackService.findCommentById(req.params.commentId)
        if (!foundComment) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        if (req.user!.id !== foundComment!.commentatorInfo.userId) return res.sendStatus(HTTP_STATUS.FORBIDDEN_403)

        const updatedComment = await feedbackService.updateCommentById(req.params.commentId, req.body.content)
        if (!updatedComment.data) return res.sendStatus(convertResultErrorCodeToHttp(updatedComment.code))
        res.status(HTTP_STATUS.NO_CONTENT_204).json(updatedComment)
    })

    router.delete('/:commentId', authMiddlewareBearer, async (req: Request, res: Response) => {
        const foundComment = await feedbackService.findCommentById(req.params.commentId)
        if (!foundComment) {
            return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        }
        if (req.user!.id !== foundComment!.commentatorInfo.userId) return res.sendStatus(HTTP_STATUS.FORBIDDEN_403)

        await feedbackService.deleteCommentById(req.params.commentId)
        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
    })

    router.get('/:id', async (req: Request, res: Response) => {
        const foundComment = await feedbackService.findCommentById(req.params.id)
        if (!foundComment) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        res.status(HTTP_STATUS.OK_200).json(foundComment)
    })

    return router
}