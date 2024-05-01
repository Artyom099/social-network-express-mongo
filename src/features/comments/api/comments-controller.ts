import {CommentsService} from "../application/comments-service";
import {IdDTO, ReqParamsBodyType, ReqParamsType} from "../../../types";
import {Response} from "express";
import {HTTP_STATUS, LikeStatus} from "../../../infrastructure/utils/enums";


export class CommentsController {
    constructor(private commentsService: CommentsService) {}

    async getComment(req: ReqParamsType<IdDTO>, res: Response) {
        const comment = await this.commentsService.findCommentById(req.params.id, req.body.userId)

        if (!comment) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        } else {
            res.status(HTTP_STATUS.OK_200).json(comment)
        }
    }

    async updateComment(req: ReqParamsBodyType<{commentId: string}, {content: string}>, res: Response) {
        const comment = await this.commentsService.findCommentById(req.params.commentId, req.user!.id)

        if (!comment) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)

        if (req.user!.id !== comment!.commentatorInfo.userId) return res.sendStatus(HTTP_STATUS.FORBIDDEN_403)

        const updatedComment = await this.commentsService.updateCommentById(req.params.commentId, req.body.content)

        if (!updatedComment) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)

        return res.status(HTTP_STATUS.NO_CONTENT_204).json(updatedComment)
    }

    async deleteComment(req: ReqParamsType<{commentId: string}>, res: Response) {
        const comment = await this.commentsService.findCommentById(req.params.commentId, req.user!.id)

        if (!comment) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)

        if (req.user!.id !== comment!.commentatorInfo.userId) return res.sendStatus(HTTP_STATUS.FORBIDDEN_403)

        await this.commentsService.deleteCommentById(req.params.commentId)
        return res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
    }

    async updateLikeStatus(req: ReqParamsBodyType<{commentId: string}, {likeStatus: LikeStatus}>, res: Response) {
        const comment = await this.commentsService.updateCommentLikes(req.params.commentId, req.user!.id, req.body.likeStatus)

        if (!comment) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        } else {
            res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
        }
    }
}