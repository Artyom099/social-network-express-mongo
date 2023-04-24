import {commentCollection} from "../db/db";
import {TComment} from "../types";
import {feedbackRepository} from "../repositories/feedback-repository";


export const feedbackService = {
    async allFeedbacks() {},
    async sendFeedback(comment: string, userId: string) {},

    async findCommentById(commentId: string): Promise<TComment | null> {
        return await commentCollection.findOne({id: commentId}, {projection: {_id: false}})
    },

    async deleteCommentById(commentId: string) {
        await feedbackRepository.deleteCommentById(commentId)
    },

    async createComment(content: string, userId: string) {

    }
}