import {commentCollection} from "../db/db";
import {ResultCode} from "../utils";
import {CommentBDType, TComment} from "../types/types";


export const feedbackRepository = {
    async findCommentByID(commentId: string) {
        const comment = await commentCollection.findOne({id: commentId}, {projection: {_id: false, postId: false}})
        if (comment) return comment
        return null
    },

    async createComment(createdComment: CommentBDType): Promise<TComment> {
        await commentCollection.insertOne(createdComment)
        return  {
            id: createdComment.id,
            content: createdComment.content,
            commentatorInfo: {
                userId: createdComment.commentatorInfo.userId,
                userLogin: createdComment.commentatorInfo.userLogin
            },
            createdAt: createdComment.createdAt
        }
    },

    async updateCommentById(commentId: string, content: string) {
        const updatedResult = await commentCollection.updateOne({id: commentId},
            {$set: {content: content}})
        if(updatedResult.matchedCount < 1) {
            return {
                data: false,
                code: ResultCode.NotFound
            }
        } else {
            return {
                data: true,
                code: ResultCode.Success
            }
        }
    },

    async deleteCommentById(commentId: string) {
        await commentCollection.deleteOne({id: commentId})
    }
}