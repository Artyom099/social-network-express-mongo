import {db} from "../db/db";
import {TBlog} from "../types";


export const blogsRepository = {
    findExistBlogs() {
        return db.blogs
    },
    createBlog(createdBlog: TBlog) {
        return db.blogs.push(createdBlog)
    },
    findBlogById(blogId: string) {
        return db.blogs.find(b => b.id === blogId)
    },
    updateBlog(foundBlog: TBlog) {
        return foundBlog
    }
}