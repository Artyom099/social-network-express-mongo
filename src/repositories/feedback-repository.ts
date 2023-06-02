import {CommentBDType, CommentViewModel} from "../types/types";
import {CommentModel} from "../shemas/feedback-schema";


export class FeedbackRepository {
    async findCommentByID(id: string) {
        return CommentModel.findOne({ id },{ _id: 0, __v: 0 })
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
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None'
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
    async updateCommentLikes(id: string, likeStatus: string): Promise<boolean | undefined> {
        const comment = await CommentModel.findOne({ id })
        console.log({comment1: comment})

       if (comment && comment.likesInfo.myStatus === likeStatus) {
           return true
       }

        if (likeStatus === 'Like') {
            if (comment?.likesInfo.myStatus === "None") {
                const result = await CommentModel.updateOne({ id }, {
                    'likesInfo.myStatus': likeStatus,   //$set: {}
                    'likesInfo.likesCount': 1           //$inc: {}
                })
                console.log({result1: result})
                return result.matchedCount === 1
            } else {
                const result = await CommentModel.updateOne({ id }, {
                    $set: {'likesInfo.myStatus': likeStatus},
                    $inc: {'likesInfo.likesCount': 1, 'likesInfo.dislikesCount': -1}
                })
                console.log({result2: result})
                return result.matchedCount === 1
            }
        }

        if (likeStatus === 'Dislike') {
            if (comment?.likesInfo.myStatus === "None") {
                const result = await CommentModel.updateOne({ id }, {
                    $set: {'likesInfo.myStatus': likeStatus},
                    $inc: {'likesInfo.dislikesCount': 1}
                })
                console.log({result3: result})
                return result.matchedCount === 1
            } else {
                const result = await CommentModel.updateOne({ id }, {
                    $set: {'likesInfo.myStatus': likeStatus},
                    $inc: {'likesInfo.likesCount': -1, 'likesInfo.dislikesCount': 1}
                })
                console.log({result4: result})
                return result.matchedCount === 1
            }
        }
    }
}