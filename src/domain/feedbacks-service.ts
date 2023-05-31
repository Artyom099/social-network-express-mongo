import {CommentBDType, CommentViewModel} from "../types/types";
import {feedbackRepository} from "../repositories/feedback-repository";
import {randomUUID} from "crypto";


export const feedbackService = {
    async findCommentById(commentId: string): Promise<CommentViewModel | null> {
        return await feedbackRepository.findCommentByID(commentId)
    },

    async createComment(postId: string, content: string, userId: string, userLogin: string) {
        const createdComment: CommentBDType = {
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
                myStatus: 'None'
            }
        }
        return await feedbackRepository.createComment(createdComment)
    },

    async updateCommentById(commentId: string, content: string) {
        return await feedbackRepository.updateCommentById(commentId, content)
    },

    async deleteCommentById(commentId: string) {
        await feedbackRepository.deleteCommentById(commentId)
    }
}