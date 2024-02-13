import {BlogViewModel} from "../../../infrastructure/types/types";
import {randomUUID} from "crypto";
import {BlogsRepository} from '../infrastructure/blogs-repository';

export class BlogsService {
    constructor(protected blogsRepository: BlogsRepository) {}

    async getBlogById(blogId: string): Promise<BlogViewModel | null> {
        return await this.blogsRepository.getBlog(blogId)
    }

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

    async updateBlogById(blogId: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
        return await this.blogsRepository.updateBlog(blogId, name, description, websiteUrl)
    }

    async deleteBlogById(blogId: string) {
        return await this.blogsRepository.deleteBlog(blogId)
    }
}