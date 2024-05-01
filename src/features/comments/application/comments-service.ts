import {CommentBDModel, CommentViewModel} from "../../../types";
import {CommentsRepository} from "../infrasrtucture/comments-repository";
import {randomUUID} from "crypto";
import {LikeStatus} from "../../../infrastructure/utils/enums";

export class CommentsService {
    constructor(protected feedbackRepository: CommentsRepository) {}

    async findCommentById(commentId: string, currentUserId?: string | null): Promise<CommentViewModel | null> {
        return this.feedbackRepository.getComment(commentId, currentUserId)
    }

    async createComment(postId: string, content: string, userId: string, userLogin: string): Promise<CommentViewModel> {
        const createdComment: CommentBDModel = {
            id: randomUUID().toString(),
            postId,
            content,
            commentatorInfo: {
                userId,
                userLogin
            },
            createdAt: new Date().toISOString(),
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                statuses: []
            }
        }
        return this.feedbackRepository.createComment(createdComment)
    }

    async updateCommentById(commentId: string, content: string): Promise<boolean> {
        return this.feedbackRepository.updateComment(commentId, content)
    }

    async deleteCommentById(commentId: string) {
        await this.feedbackRepository.deleteComment(commentId)
    }

    async updateCommentLikes(commentId: string, currentUserId: string, likeStatus: LikeStatus): Promise<boolean> {
        return this.feedbackRepository.updateCommentLikes(commentId, currentUserId, likeStatus)
    }
}