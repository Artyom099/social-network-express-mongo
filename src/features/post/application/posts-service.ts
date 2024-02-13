import {BlogViewModel, PostViewModel} from "../../../infrastructure/types/types";
import {PostsRepository} from "../infrastructure/posts-repository";
import {randomUUID} from "crypto";
import {LikeStatus} from "../../../infrastructure/utils/enums";
import {usersService} from "../../user/application/users-service";


export class PostsService {
    constructor(private postsRepository: PostsRepository) {}

    async getPostById(postId: string, userId?: string): Promise<PostViewModel | null> {
        return this.postsRepository.getPostById(postId, userId)
    }

    async createPost(title: string, shortDescription: string, content: string, blog: BlogViewModel | null): Promise<PostViewModel> {
        const dto: PostViewModel = {
            id: randomUUID().toString(),
            title,
            shortDescription,
            content,
            blogId: blog!.id,
            blogName: blog!.name,
            createdAt: new Date().toISOString(),
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: LikeStatus.None,
                newestLikes: []
            }
        }

        return this.postsRepository.createPost(dto)
    }

    async updatePostById(postId: string, title: string, shortDescription: string, content: string): Promise<boolean> {
        return this.postsRepository.updatePostById(postId, title, shortDescription, content)
    }

    async deletePostById(postId: string) {
        return this.postsRepository.deletePostById(postId)
    }

    async updatePostLikes(postId: string, userId: string, likeStatus: LikeStatus): Promise<boolean> {
        const user = await usersService.findUserById(userId)

        const addedAt = new Date()
        return this.postsRepository.updatePostLikes(postId, userId, likeStatus, addedAt, user!.login)
    }
}