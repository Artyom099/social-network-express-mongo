import {BlogViewModel} from "../../../types";
import {BlogModel} from "./blogs-schema";


export class BlogsRepository {
    async createBlog(dto: BlogViewModel): Promise<BlogViewModel> {
        await BlogModel.insertMany(dto)

        return {
            id: dto.id,
            name: dto.name,
            description: dto.description,
            websiteUrl: dto.websiteUrl,
            createdAt: dto.createdAt,
            isMembership: dto.isMembership
        }
    }

    async getBlog(id: string): Promise<BlogViewModel | null> {
        return BlogModel.findOne({ id }, { _id: 0, __v: 0 })
    }

    async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
        const result = await BlogModel.updateOne({ id },  { name, description, websiteUrl })

        return result.modifiedCount === 1
    }

    async deleteBlog(id: string): Promise<boolean> {
        const result = await BlogModel.deleteOne({ id })

        return result.deletedCount === 1
    }
}