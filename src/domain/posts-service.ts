import {TBlog, TPost} from "../types";
import {Result} from "../utils";
import {postsRepository} from "../repositories/posts-repository";


export const postsService = {
    async findExistPosts(): Promise<TPost[]> {      // get
        return await postsRepository.findExistPosts()
    },

    async createPost(title: string, shortDescription: string, content: string, blog: TBlog | null): Promise<TPost> {    // post
        const dateNow = new Date()
        const createdPost: TPost = {
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

    async findPostById(postId: string): Promise<TPost | null> {   // get, put, delete
        return await postsRepository.findPostById(postId)
    },

    async updatePostById(postId: string, title: string, shortDescription: string, content: string): Promise<Result<boolean>> {      // put
        return await postsRepository.updatePostById(postId, title, shortDescription, content)
    },

    async deletePostById(postId: string) {    // delete
        return await postsRepository.deletePostById(postId)
    },
}