import {db} from "../db/db";
import {TBlog} from "../types";


export const blogsRepository = {
    findExistBlogs() {      // get
        return db.blogs
    },
    createBlog(name: string, description: string, websiteUrl: string): TBlog {    // post
        const createdBlog: TBlog = {
            id: (+new Date()).toString(),
            name,
            description,
            websiteUrl
        }
        db.blogs.push(createdBlog)
        return createdBlog
    },
    findBlogById(blogId: string): TBlog | null {    // get, put, delete
        const blog = db.blogs.find(b => b.id === blogId)
        if (blog) return blog
        else return null
    },
    updateBlog(foundBlog: TBlog, name: string, description: string, websiteUrl: string): TBlog {      // put
        foundBlog.name = name
        foundBlog.description = description
        foundBlog.websiteUrl = websiteUrl
        return foundBlog
    },
    deleteBlogById(blogId: string) {    // delete
        return db.blogs = db.blogs.filter(b => b.id !== blogId)
    }
}