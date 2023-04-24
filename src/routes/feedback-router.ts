import express, {Request, Response} from "express";
import {authMiddleware} from "../middleware/input-validation-middleware";
import {HTTP_STATUS} from "../utils";
import {feedbackService} from "../domain/feedbacks-service";


export const feedbackRouter = () => {
    const router = express.Router()
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