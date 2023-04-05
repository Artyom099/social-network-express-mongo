import {db} from "../db/db";
import {TBlog} from "../types";
import {foundBlog} from "../routes/blogs-router";


export const blogsRepository = {
    findBlogs() {
        return db.blogs
    },
    createBlog(createdBlog: TBlog) {
        db.blogs.push(createdBlog)
        return createdBlog
    },
    findOneBlog() {
        return db.blogs.id
    },
    updateBlog(foundBlog: TBlog) {
        return
    }
}