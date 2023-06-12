import {PostViewModel} from "../types/types";
import {PostModel} from "../shemas/posts-schema";
import {LikeStatus} from "../utils/constants";


export class PostsRepository {
    async getPostById(id: string, currentUserId?: string | null): Promise<PostViewModel | null> {
        const post = await PostModel.findOne({ id }, {_id: 0})
        if (!post) return null
        let myStatus = LikeStatus.None
        let likesCount = 0
        let dislikesCount = 0
        // найти 3 последних лайка
        let newestLikes: any[] = post.extendedLikesInfo.statuses.slice(-3)
        post.extendedLikesInfo.statuses.forEach(s => {
            if (s.userId === currentUserId) myStatus = s.status
            if (s.status === LikeStatus.Like) likesCount++
            if (s.status === LikeStatus.Dislike) dislikesCount++
        })
        return {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: {
                likesCount,
                dislikesCount,
                myStatus,
                newestLikes
            }
        }
    }
    async createPost(createdPost: PostViewModel): Promise<PostViewModel> {
        await PostModel.insertMany(createdPost)
        return {
            id: createdPost.id,
            title: createdPost.title,
            shortDescription: createdPost.shortDescription,
            content: createdPost.content,
            blogId: createdPost.blogId,
            blogName: createdPost.blogName,
            createdAt: createdPost.createdAt,
            extendedLikesInfo: {
                likesCount: createdPost.extendedLikesInfo.likesCount,
                dislikesCount: createdPost.extendedLikesInfo.dislikesCount,
                myStatus: LikeStatus.None,
                newestLikes: []
            }
        }
    }
    async updatePostById(id: string, title: string, shortDescription: string, content: string): Promise<boolean> {
        const result = await PostModel.updateOne({ id }, { title, shortDescription, content })
        return result.matchedCount === 1
    }
    async deletePostById(id: string) {
        const result = await PostModel.deleteOne({ id })
        return result.deletedCount === 1
    }
    async updatePostLikes(id: string, userId: string, newLikeStatus: LikeStatus, addedAt: string, login: string): Promise<boolean> {
        const post = await PostModel.findOne({ id })
        if (!post) return false
        // если юзер есть в массиве, обновляем его статус
        for (const s of post.extendedLikesInfo.statuses) {
            if (s.userId === userId) {
                if (s.status === newLikeStatus) return true
                const result = await PostModel.updateOne({ id }, {'likesInfo.statuses': {addedAt, userId, status: newLikeStatus, login}})
                return result.modifiedCount === 1
            }
        }
        // иначе добавляем юзера, его лайк статус, дату и логин в массив
        const result = await PostModel.updateOne({ id }, {$addToSet: {'likesInfo.statuses':
                    {addedAt, userId, status: newLikeStatus, login}}})
        return result.modifiedCount === 1
    }
}