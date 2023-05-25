import {blogsRepository} from "../repositories/blogs-repository";
import {TBlog} from "../types/types";
import {randomUUID} from "crypto";


export const blogsService = {
    async createBlog(name: string, description: string, websiteUrl: string): Promise<TBlog> {    // post
        const createdBlog: TBlog = {
            id: randomUUID(),
            name,
            description,
            websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        return await blogsRepository.createBlog(createdBlog)
    },

    async findBlogById(blogId: string): Promise<TBlog | null> {    // get, put, delete
        return await blogsRepository.findBlogById(blogId)
    },

    async updateBlogById(blogId: string, name: string, description: string, websiteUrl: string): Promise<boolean> {   // put
        return await blogsRepository.updateBlogById(blogId, name, description, websiteUrl)
    },

    async deleteBlogById(blogId: string) {    // delete
        return await blogsRepository.deleteBlogById(blogId)
    }
}