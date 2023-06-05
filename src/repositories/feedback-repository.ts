import {CommentBDType, CommentViewModel} from "../types/types";
import {CommentModel} from "../shemas/feedback-schema";
import {LikeStatus} from "../utils/constants";


export class FeedbackRepository {
    async findCommentByID(id: string) {
        return CommentModel.findOne({ id }, { _id: 0, __v: 0, postId: 0 })
    }
    async createComment(createdComment: CommentBDType): Promise<CommentViewModel> {
        await CommentModel.insertMany(createdComment)
        return  {
            id: createdComment.id,
            content: createdComment.content,
            commentatorInfo: {
                userId: createdComment.commentatorInfo.userId,
                userLogin: createdComment.commentatorInfo.userLogin
            },
            createdAt: createdComment.createdAt,
            likesInfo: {
                likesCount: createdComment.likesInfo.likesCount,
                dislikesCount: createdComment.likesInfo.dislikesCount,
                myStatus: createdComment.likesInfo.myStatus
            }
        }
    }
    async updateCommentById(id: string, content: string): Promise<boolean> {
        const result = await CommentModel.updateOne({ id }, { content })
        return result.matchedCount === 1
    }
    async deleteCommentById(id: string) {
        const result = await CommentModel.deleteOne({ id })
        return result.deletedCount === 1
    }
    async updateCommentLikes(id: string, likeStatus: LikeStatus): Promise<boolean> {
        const comment = await CommentModel.findOne({ id })
        console.log({comment1: comment})

       if (comment && comment.likesInfo.myStatus === likeStatus) {
           return true
       }

        if (likeStatus === LikeStatus.Like) {
            if (comment?.likesInfo.myStatus === LikeStatus.None) {
                const result = await CommentModel.updateOne({ id }, {
                    'likesInfo.myStatus': likeStatus,
                    'likesInfo.likesCount': 1
                    })
                console.log({result1: result})
                return result.matchedCount === 1

            } else {
                const result = await CommentModel.updateOne({ id }, {
                    'likesInfo.myStatus': likeStatus,
                    'likesInfo.likesCount': 1, 'likesInfo.dislikesCount': -1
                })
                console.log({result2: result})
                return result.matchedCount === 1
            }
        }

        if (likeStatus === LikeStatus.Dislike) {
            if (comment?.likesInfo.myStatus === LikeStatus.None) {
                const result = await CommentModel.updateOne({ id }, {
                    'likesInfo.myStatus': likeStatus,
                    'likesInfo.dislikesCount': 1
                })
                console.log({result3: result})
                return result.matchedCount === 1
            } else {
                const result = await CommentModel.updateOne({ id }, {
                    'likesInfo.myStatus': likeStatus,
                    'likesInfo.likesCount': -1, 'likesInfo.dislikesCount': 1
                })
                console.log({result4: result})
                return result.matchedCount === 1
            }
        }
        return false
    }
}

// const result = await CommentModel.updateOne({ id }, {})
    // .set({'likesInfo.myStatus': likeStatus}, {'likesInfo.likesCount': 1})