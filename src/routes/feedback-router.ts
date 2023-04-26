import express, {Request, Response} from "express"
import {convertResultErrorCodeToHttp, HTTP_STATUS} from "../utils"
import {feedbackService} from "../domain/feedbacks-service"
import {authMiddlewareBearer} from "../middleware/auth-middleware";


export const feedbackRouter = () => {
    const router = express.Router()

    router.put('/:commentId', authMiddlewareBearer, async (req: Request, res: Response) => {
        const result = await feedbackService.updateCommentById(req.params.id, req.body.content)

        if (!result.data) return res.sendStatus(convertResultErrorCodeToHttp(result.code))

        const updatedComment = await feedbackService.findCommentById(req.params.id)
        res.status(HTTP_STATUS.NO_CONTENT_204).json(updatedComment)
    })

    router.delete('/:commentId', authMiddlewareBearer, async (req: Request, res: Response) => {
        const foundComment = await feedbackService.findCommentById(req.params.id)
        if (!foundComment) res.sendStatus(HTTP_STATUS.NOT_FOUND_404)

        await feedbackService.deleteCommentById(req.params.id)
        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
    })

    router.get('/:id', async (req: Request, res: Response) => {
        const foundComment = await feedbackService.findCommentById(req.params.id)
        if (!foundComment) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        res.status(HTTP_STATUS.OK_200).json(foundComment)
    })

    return router
}