import {BlogModel} from "../db/db";
import {BlogViewModel} from "../types/types";


export class BlogsRepository {
    async createBlog(createdBlog: BlogViewModel): Promise<BlogViewModel> {
        await BlogModel.insertMany(createdBlog)
        return {
            id: createdBlog.id,
            name: createdBlog.name,
            description: createdBlog.description,
            websiteUrl: createdBlog.websiteUrl,
            createdAt: createdBlog.createdAt,
            isMembership: createdBlog.isMembership
        }
    }
    async findBlogById(id: string): Promise<BlogViewModel | null> {
        return BlogModel.findOne({ id },{ _id: 0, __v: 0 })
    }
    async updateBlogById(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
        const res = await BlogModel.updateOne({ id },  { name, description, websiteUrl })
        return res.matchedCount === 1
    }
    async deleteBlogById(id: string): Promise<boolean> {
        const res = await BlogModel.deleteOne({ id })
        return res.deletedCount === 1
    }
}