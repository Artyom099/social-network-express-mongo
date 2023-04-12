import {blogCollection} from "../db/db";
import {TBlog} from "../types";
import {Result, ResultCode} from "../utils";


export const blogsRepository = {
    async findExistBlogs(): Promise<TBlog[]> {      // get
        return await blogCollection.find({}).toArray();
    },
    async createBlog(name: string, description: string,
               websiteUrl: string): Promise<TBlog> {    // post
        const dateNow = new Date()
        const createdBlog: TBlog = {
            id: (+dateNow).toString(),
            name,
            description,
            websiteUrl,
            createdAt: dateNow.toISOString(),
            isMembership: false
        }
        await blogCollection.insertOne(createdBlog)
        return createdBlog
    },
    async findBlogById(blogId: string): Promise<TBlog | null> {    // get, put, delete
        const blog = await blogCollection.findOne({id: blogId})
        if (blog) return blog
        else return null
    },
    async updateBlogById(blogId: string, name: string,
               description: string, websiteUrl: string): Promise<Result<boolean>> {   // put
        const updatedResult = await blogCollection.updateOne({id: blogId},
        {$set: {name: name, description: description, websiteUrl: websiteUrl}})

        if(updatedResult.matchedCount < 1 ) {
            return {
                data: false,
                code: ResultCode.NotFound
            }
        } else {
            return {
                data: true,
                code: ResultCode.Success
            }
        }
    },
    async deleteBlogById(blogId: string) {    // delete
        return await blogCollection.deleteOne({id: blogId})
    }
}

