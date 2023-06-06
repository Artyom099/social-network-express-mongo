import {FeedbackService} from "../domain/feedbacks-service";
import {IdDTO, ReqParamsBodyType, ReqParamsType} from "../types/types";
import {Response} from "express";
import {HTTP_STATUS, LikeStatus} from "../utils/constants";


export class FeedbackController {
    constructor(protected feedbackService: FeedbackService) {}
    async getComment(req: ReqParamsType<IdDTO>, res: Response) {
        const foundComment = await this.feedbackService.findCommentById(req.params.id)
        if (!foundComment) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        } else {
            res.status(HTTP_STATUS.OK_200).json(foundComment)
        }
    }
    async updateComment(req: ReqParamsBodyType<{commentId: string}, {content: string}>, res: Response) {
        const foundComment = await this.feedbackService.findCommentById(req.params.commentId, req.user!.id)
        if (!foundComment) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        }
        if (req.user!.id !== foundComment!.commentatorInfo.userId) {
            res.sendStatus(HTTP_STATUS.FORBIDDEN_403)
        }
        const updatedComment = await this.feedbackService.updateCommentById(req.params.commentId, req.body.content)
        if (!updatedComment) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        } else {
            res.status(HTTP_STATUS.NO_CONTENT_204).json(updatedComment)
        }
    }
    async deleteComment(req: ReqParamsType<{commentId: string}>, res: Response) {
        const foundComment = await this.feedbackService.findCommentById(req.params.commentId, req.user!.id)
        if (!foundComment) {
            return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        }
        if (req.user!.id !== foundComment!.commentatorInfo.userId) {
            res.sendStatus(HTTP_STATUS.FORBIDDEN_403)
        } else {
            await this.feedbackService.deleteCommentById(req.params.commentId)
            res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
        }
    }
    async updateLikeStatus(req: ReqParamsBodyType<{commentId: string}, {likeStatus: LikeStatus}>, res: Response) {
        const likedComment = await this.feedbackService.updateCommentLikes(req.params.commentId, req.body.likeStatus)

        if (!likedComment) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        } else {
            res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
        }
    }
}