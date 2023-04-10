import {db} from "../db/db";
import {TBlog, TPost} from "../types";


export const postsRepository = {
    async findExistPosts(): Promise<TPost[]> {      // get
        return db.posts
    },
    async createPost(title: string, shortDescription: string,
               content: string, blogId:
               string, blog: TBlog | null): Promise<TPost> {    // post
        const createdPost: TPost = {
            id: (+new Date()).toString(),
            title,
            shortDescription,
            content,
            blogId,
            blogName: blog!.name
        }
        db.posts.push(createdPost)
        return createdPost
    },
    async findPostById(postId: string): Promise<TPost | null> {   // get, put, delete
        const post = db.posts.find(p => p.id === postId)
        if (post) return post
        else return null
    },
    async updatePost(foundPost: TPost, title: string,
               shortDescription: string,
               content: string): Promise<TPost> {      // put
        foundPost.title = title
        foundPost.shortDescription = shortDescription
        foundPost.content = content
        return foundPost
    },
    async deletePostById(postId: string): Promise<TPost[]> {    // delete
        return db.posts = db.posts.filter(p => p.id !== postId)
    }
}