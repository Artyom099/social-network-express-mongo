import {BlogViewModel, PostViewModel} from "../types/types";
import {PostsRepository} from "../repositories/posts-repository";
import {randomUUID} from "crypto";
import {LikeStatus} from "../utils/constants";
import {usersService} from "./users-service";


export class PostsService {
    constructor(protected postsRepository: PostsRepository) {}
    async getPostById(postId: string, userId?: string): Promise<PostViewModel | null> {
        return this.postsRepository.getPostById(postId, userId)
    }
    async createPost(title: string, shortDescription: string, content: string, blog: BlogViewModel | null): Promise<PostViewModel> {
        const createdPost: PostViewModel = {
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
        return this.postsRepository.createPost(createdPost)
    }
    async updatePostById(postId: string, title: string, shortDescription: string, content: string): Promise<boolean> {
        return this.postsRepository.updatePostById(postId, title, shortDescription, content)
    }
    async deletePostById(postId: string) {
        return this.postsRepository.deletePostById(postId)
    }
    async updatePostLikes(postId: string, userId: string, likeStatus: LikeStatus): Promise<boolean> {
        const user = await usersService.findUserById(userId)
        // if (!user) return false
        const addedAt = new Date().toISOString()
        return this.postsRepository.updatePostLikes(postId, userId, likeStatus, addedAt, user!.login)
    }
}