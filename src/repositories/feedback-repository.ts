import {commentCollection} from "../db/db";
import {CommentBDType, CommentViewModel} from "../types/types";


export const feedbackRepository = {
    async findCommentByID(id: string) {
        const comment = await commentCollection.findOne({ id }, {projection: {_id: 0, postId: 0}})
        if (comment) return comment
        else return null
    },

    async createComment(createdComment: CommentBDType): Promise<CommentViewModel> {
        await commentCollection.insertOne(createdComment)
        return  {
            id: createdComment.id,
            content: createdComment.content,
            commentatorInfo: {
                userId: createdComment.commentatorInfo.userId,
                userLogin: createdComment.commentatorInfo.userLogin
            },
            createdAt: createdComment.createdAt,
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None'
            }
        }
    },

    async updateCommentById(id: string, content: string): Promise<boolean> {
        const result = await commentCollection.updateOne({ id }, {$set: {content: content}})
        return result.matchedCount === 1
        // if(updatedResult.matchedCount < 1) {
        //     return {
        //         data: false,
        //         code: ResultCode.NotFound
        //     }
        // } else {
        //     return {
        //         data: true,
        //         code: ResultCode.Success
        //     }
        // }
    },

    async deleteCommentById(id: string) {
        await commentCollection.deleteOne({ id })
    },

    async updateCommentLikes(id: string, likeStatus: string): Promise<boolean | undefined> {
        const comment = await commentCollection.findOne({ id })
        if (comment?.likesInfo.myStatus === likeStatus) {
            return true
        }
        if (likeStatus === 'Like') {
            if (comment?.likesInfo.myStatus === "None") {
                const result = await commentCollection.updateOne({ id }, {
                    $set: {'likesInfo.myStatus': likeStatus},
                    $inc: {'likesInfo.likesCount': 1}
                })
                return result.matchedCount === 1
            } else {
                const result = await commentCollection.updateOne({ id }, {
                    $set: {'likesInfo.myStatus': likeStatus},
                    $inc: {'likesInfo.likesCount': 1, 'likesInfo.dislikesCount': -1}
                })
                return result.matchedCount === 1
            }
        }
        if (likeStatus === 'Dislike') {
            if (comment?.likesInfo.myStatus === "None") {
                const result = await commentCollection.updateOne({ id }, {
                    $set: {'likesInfo.myStatus': likeStatus},
                    $inc: {'likesInfo.dislikesCount': 1}
                })
                return result.matchedCount === 1
            } else {
                const result = await commentCollection.updateOne({ id }, {
                    $set: {'likesInfo.myStatus': likeStatus},
                    $inc: {'likesInfo.likesCount': -1, 'likesInfo.dislikesCount': 1}
                })
                return result.matchedCount === 1
            }
        }
    }
}