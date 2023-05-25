import {blogCollection} from "../db/db";
import {TBlog} from "../types/types";


export const blogsRepository = {
    async createBlog(createdBlog: TBlog): Promise<TBlog> {    // post
        await blogCollection.insertOne(createdBlog)
        return {
            id: createdBlog.id,
            name: createdBlog.name,
            description: createdBlog.description,
            websiteUrl: createdBlog.websiteUrl,
            createdAt: createdBlog.createdAt,
            isMembership: createdBlog.isMembership
        }
    },

    async findBlogById(blogId: string): Promise<TBlog | null> {    // get, put, delete
        const blog = await blogCollection.findOne({id: blogId}, {projection: {_id: 0}})
        if (blog) return blog
        else return null
    },

    async updateBlogById(blogId: string, name: string, description: string, websiteUrl: string): Promise<boolean> {   // put
        const result = await blogCollection.updateOne({id: blogId}, {$set: {name: name, description: description, websiteUrl: websiteUrl}})
        return result.matchedCount === 1
    },

    async deleteBlogById(blogId: string) {    // delete
        return await blogCollection.deleteOne({id: blogId})
    }
}