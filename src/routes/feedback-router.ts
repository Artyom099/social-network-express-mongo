import express, {Request, Response} from "express"
import {HTTP_STATUS} from "../utils"
import {feedbackService} from "../domain/feedbacks-service"
import {authMiddleware} from "../middleware/auth-middleware";


export const feedbackRouter = () => {
    const router = express.Router()

    router.put('/:commentId', authMiddleware, async (req: Request, res: Response) => {

    })

    router.delete('/:commentId', authMiddleware, async (req: Request, res: Response) => {
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




    router.get('/', async (req: Request, res: Response) => {
        const users = await feedbackService.allFeedbacks()
        res.send(users)
    })

    router.post('/', authMiddleware, async (req: Request, res: Response) => {
        const newProduct = await feedbackService.sendFeedback(req.body.comment, req.user!.id)
        res.status(HTTP_STATUS.CREATED_201).send(newProduct)
    })

    return router
}