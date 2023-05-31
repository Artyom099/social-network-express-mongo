import {Result, BlogViewModel, PostViewModel} from "../types/types";
import {postsRepository} from "../repositories/posts-repository";


export const postsService = {
    async createPost(title: string, shortDescription: string, content: string, blog: BlogViewModel | null): Promise<PostViewModel> {    // post
        const dateNow = new Date()
        const createdPost: PostViewModel = {
            id: (+dateNow).toString(),
            title,
            shortDescription,
            content,
            blogId: blog!.id,
            blogName: blog!.name,
            createdAt: dateNow.toISOString()
        }
        return await postsRepository.createPost(createdPost)
    },

    async findPostById(postId: string): Promise<PostViewModel | null> {   // get, put, delete
        return await postsRepository.findPostById(postId)
    },

    async updatePostById(postId: string, title: string, shortDescription: string, content: string): Promise<Result<boolean>> {      // put
        return await postsRepository.updatePostById(postId, title, shortDescription, content)
    },

    async deletePostById(postId: string) {    // delete
        return await postsRepository.deletePostById(postId)
    },
}