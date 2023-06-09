import {BlogViewModel, PostViewModel} from "../types/types";
import {PostsRepository} from "../repositories/posts-repository";
import {randomUUID} from "crypto";


export class PostsService {
    constructor(protected postsRepository: PostsRepository) {}
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
        return this.postsRepository.createPost(createdPost)
    }
    async findPostById(postId: string): Promise<PostViewModel | null> {
        return this.postsRepository.findPostById(postId)
    }
    async updatePostById(postId: string, title: string, shortDescription: string, content: string): Promise<boolean> {
        return this.postsRepository.updatePostById(postId, title, shortDescription, content)
    }
    async deletePostById(postId: string) {
        return this.postsRepository.deletePostById(postId)
    }
}