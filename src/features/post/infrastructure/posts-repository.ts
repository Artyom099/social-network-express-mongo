import {PostViewModel} from "../../../types";
import { LikeStatusesSchema, PostModel } from '../schema/posts-schema';
import {LikeStatus} from "../../../infrastructure/utils/enums";

export class PostsRepository {
    async getPostById(id: string, currentUserId?: string | null): Promise<PostViewModel | null> {
        const post = await PostModel.findOne({ id })
        if (!post) return null

        let myStatus = LikeStatus.None
        let likesCount = 0
        let dislikesCount = 0
        let newestLikes: any[] = []

        post.extendedLikesInfo.statuses.forEach((p: any) => {
            if (p.userId === currentUserId) myStatus = p.status
            if (p.status === LikeStatus.Like) {
                likesCount++
                newestLikes.push({addedAt: p.addedAt, userId: p.userId, login: p.login})
            }
            if (p.status === LikeStatus.Dislike) dislikesCount++
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
                newestLikes: newestLikes.sort((a, b) => a.addedAt - b.addedAt).slice(-3).reverse()
            }
        }
    }

    async createPost(dto: PostViewModel): Promise<PostViewModel> {
        await PostModel.insertMany(dto)
        return {
            id: dto.id,
            title: dto.title,
            shortDescription: dto.shortDescription,
            content: dto.content,
            blogId: dto.blogId,
            blogName: dto.blogName,
            createdAt: dto.createdAt,
            extendedLikesInfo: {
                likesCount: dto.extendedLikesInfo.likesCount,
                dislikesCount: dto.extendedLikesInfo.dislikesCount,
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

    async updatePostLikes(id: string, userId: string, newLikeStatus: LikeStatus, addedAt: Date, login: string): Promise<boolean> {
        const post = await PostModel.findOne({ id })
        if (!post) return false

        // если юзер есть в массиве, обновляем его статус
        for (const s of post.extendedLikesInfo.statuses) {
            if (s.userId === userId) {
                if (s.status === newLikeStatus) return true
                const result = await PostModel.updateOne({ id }, {'extendedLikesInfo.statuses': {addedAt, userId, status: newLikeStatus, login}})
                return result.modifiedCount === 1
            }
        }

        // иначе добавляем юзера, его лайк статус, дату и логин в массив
        const result = await PostModel.updateOne({ id }, {$addToSet: {'extendedLikesInfo.statuses':
                    {addedAt, userId, status: newLikeStatus, login}}})

        return result.modifiedCount === 1
    }
}