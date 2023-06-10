import {CommentBDType, CommentViewModel} from "../types/types";
import {CommentModel} from "../shemas/feedback-schema";
import {LikeStatus} from "../utils/constants";


export class FeedbackRepository {
    async findCommentByID(id: string, currentUserId?: string | null): Promise<CommentViewModel | null> {
        const comment = await CommentModel.findOne({ id })
        if (!comment) return null
        let myStatus = LikeStatus.None
        let likesCount = 0
        let dislikesCount = 0
        comment.likesInfo.statuses.forEach(s => {
            if (s.userId === currentUserId) myStatus = s.status
            if (s.status === LikeStatus.Like) likesCount++
            if (s.status === LikeStatus.Dislike) dislikesCount++
        })
        return {
            id: comment.id,
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt,
            likesInfo: {
                likesCount,
                dislikesCount,
                myStatus
            }
        }
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
                myStatus: LikeStatus.None
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
    async updateCommentLikes(id: string, currentUserId: string, newLikeStatus: LikeStatus): Promise<boolean> {
        const comment = await CommentModel.findOne({ id })
        if (!comment) return false
        // если юзер есть в массиве, обновляем его статус
        for (const s of comment.likesInfo.statuses) {
            if (s.userId === currentUserId) {
                if (s.status === newLikeStatus) return true
                const result = await CommentModel.updateOne({ id }, {'likesInfo.statuses': {userId: currentUserId, status: newLikeStatus}})
                return result.modifiedCount === 1
            }
        }
        // иначе добавляем юзера и его статус в массив
        const result = await CommentModel.updateOne({ id }, {$addToSet: {'likesInfo.statuses': {userId: currentUserId, status: `${newLikeStatus}`}}})
        return result.modifiedCount === 1
    }
}