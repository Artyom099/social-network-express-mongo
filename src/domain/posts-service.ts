import {BlogViewModel, PostViewModel} from "../types/types";
import {PostsRepository} from "../repositories/posts-repository";
import {randomUUID} from "crypto";
import {LikeStatus} from "../utils/constants";


export class PostsService {
    constructor(protected postsRepository: PostsRepository) {}
    async getPostById(postId: string): Promise<PostViewModel | null> {
        return this.postsRepository.getPostById(postId)
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
    async updatePostLikes(postId: string, currentUserId: string, likeStatus: LikeStatus): Promise<boolean> {
        const addedAt = new Date().toString()
        const login = ''
        return this.postsRepository.updatePostLikes(postId, currentUserId, likeStatus, addedAt, login)
    }
}