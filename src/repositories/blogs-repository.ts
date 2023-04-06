import {db} from "../db/db";
import {TBlog} from "../types";


export const blogsRepository = {
    findExistBlogs() {                  // get
        return db.blogs
    },
    createBlog(createdBlog: TBlog) {    // post
        return db.blogs.push(createdBlog)
    },
    findBlogById(blogId: string) {      // get, put, delete
        return db.blogs.find(b => b.id === blogId)
    },
    updateBlog(foundBlog: TBlog, name: string, description: string, websiteUrl: string) {      // put
        foundBlog.name = name
        foundBlog.description = description
        foundBlog.websiteUrl = websiteUrl
        return foundBlog
    },
    deleteBlogById(blogId: string) {    // delete
        return db.blogs = db.blogs.filter(b => b.id !== blogId)
    }
}