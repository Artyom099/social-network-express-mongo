import {db} from "../db/db";
import {TBlog} from "../types";
import {blogId, foundBlog} from "../routes/blogs-router";


export const blogsRepository = {
    findExistsBlogs() {
        return db.blogs
    },
    createBlog(createdBlog: TBlog) {
        db.blogs.push(createdBlog)
        return createdBlog
    },
    findBlogById(blogId) {
        const foundBlog = db.blogs.find(b => b.id === blogId)
        return foundBlog
    },
    updateBlog(foundBlog: TBlog) {
        return foundBlog
    }
}