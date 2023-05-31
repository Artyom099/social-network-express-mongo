import {BlogViewModel, PostViewModel} from "../types/types";
import {postsRepository} from "../repositories/posts-repository";
import {randomUUID} from "crypto";


export const postsService = {
    async createPost(title: string, shortDescription: string, content: string, blog: BlogViewModel | null): Promise<PostViewModel> {
        const createdPost: PostViewModel = {
            id: randomUUID().toString(),
            title,
            shortDescription,
            content,
            blogId: blog!.id,
            blogName: blog!.name,
            createdAt: new Date().toISOString()
        }
        return await postsRepository.createPost(createdPost)
    },

    async findPostById(postId: string): Promise<PostViewModel | null> {
        return await postsRepository.findPostById(postId)
    },

    async updatePostById(postId: string, title: string, shortDescription: string, content: string): Promise<boolean> {
        return await postsRepository.updatePostById(postId, title, shortDescription, content)
    },

    async deletePostById(postId: string) {
        return await postsRepository.deletePostById(postId)
    },
}