import {blogsRepository} from "../repositories/blogs-repository";
import {Result, TBlog} from "../types/types";


export const blogsService = {
    async findExistBlogs(): Promise<TBlog[]> {      // get
        return await blogsRepository.findExistBlogs()
    },

    async createBlog(name: string, description: string, websiteUrl: string): Promise<TBlog> {    // post
        const dateNow = new Date()
        const createdBlog: TBlog = {
            id: (+dateNow).toString(),
            name,
            description,
            websiteUrl,
            createdAt: dateNow.toISOString(),
            isMembership: false
        }
        return await blogsRepository.createBlog(createdBlog)
    },

    async findBlogById(blogId: string): Promise<TBlog | null> {    // get, put, delete
        return await blogsRepository.findBlogById(blogId)
    },

    async updateBlogById(blogId: string, name: string, description: string, websiteUrl: string): Promise<Result<boolean>> {   // put
        return await blogsRepository.updateBlogById(blogId, name, description, websiteUrl)
    },

    async deleteBlogById(blogId: string) {    // delete
        return await blogsRepository.deleteBlogById(blogId)
    }
}