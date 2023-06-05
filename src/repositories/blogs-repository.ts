import {BlogViewModel} from "../types/types";
import {BlogModel} from "../shemas/blogs-schema";


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
        const result = await BlogModel.updateOne({ id },  { name, description, websiteUrl })
        return result.modifiedCount === 1
    }
    async deleteBlogById(id: string): Promise<boolean> {
        const result = await BlogModel.deleteOne({ id })
        return result.deletedCount === 1
    }
}