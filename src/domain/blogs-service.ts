import {BlogsRepository} from "../repositories/blogs-repository";
import {BlogViewModel} from "../types/types";
import {randomUUID} from "crypto";


export class BlogsService {
    constructor(protected blogsRepository: BlogsRepository) {}
    async createBlog(name: string, description: string, websiteUrl: string): Promise<BlogViewModel> {
        const createdBlog: BlogViewModel = {
            id: randomUUID(),
            name,
            description,
            websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        return await this.blogsRepository.createBlog(createdBlog)
    }
    async findBlogById(blogId: string): Promise<BlogViewModel | null> {
        return await this.blogsRepository.findBlogById(blogId)
    }
    async updateBlogById(blogId: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
        return await this.blogsRepository.updateBlogById(blogId, name, description, websiteUrl)
    }
    async deleteBlogById(blogId: string) {
        return await this.blogsRepository.deleteBlogById(blogId)
    }
}