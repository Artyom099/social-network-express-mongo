import {blogCollection, db} from "../db/db";
import {TBlog} from "../types";


export const blogsRepository = {
    async findExistBlogs() {      // get
        return await blogCollection.find({}).toArray();
    },
    async createBlog(name: string, description: string,
               websiteUrl: string): Promise<TBlog> {    // post
        const createdBlog: TBlog = {
            id: (+new Date()).toString(),
            name,
            description,
            websiteUrl
        }
        db.blogs.push(createdBlog)
        return createdBlog
    },
    async findBlogById(blogId: string): Promise<TBlog | null> {    // get, put, delete
        const blog = db.blogs.find(b => b.id === blogId)
        if (blog) return blog
        else return null
    },
    async updateBlog(foundBlog: TBlog, name: string,
               description: string, websiteUrl: string): Promise<TBlog> {   // put
        foundBlog.name = name
        foundBlog.description = description
        foundBlog.websiteUrl = websiteUrl
        return foundBlog
    },
    async deleteBlogById(blogId: string): Promise<TBlog[]> {    // delete
        return db.blogs = db.blogs.filter(b => b.id !== blogId)
    }
}