import {commentCollection} from "../db/db";
import {TComment} from "../types";
import {feedbackRepository} from "../repositories/feedback-repository";


export const feedbackService = {
    async findCommentById(commentId: string): Promise<TComment | null> {
        return await commentCollection.findOne({id: commentId}, {projection: {_id: false}})
    },

    async updateCommentById(commentId: string, content: string) {
        return await feedbackRepository.updateCommentById(commentId, content)
    },

    async deleteCommentById(commentId: string) {
        await feedbackRepository.deleteCommentById(commentId)
    },

    async createComment(content: string, userId: string) {
        const dateNow = new Date()
        const createdComment: TComment = {
            id: (+dateNow).toString(),
            content,
            commentatorInfo: {
                userId,
                userLogin: '??'
            },
            createdAt: dateNow.toISOString()
        }
        return await feedbackRepository.createComment(createdComment)
    }
}