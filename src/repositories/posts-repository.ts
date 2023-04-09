import {db} from "../db/db";
import {TBlog, TPost} from "../types";


export const postsRepository = {
    findExistPosts() {      // get
        return db.posts
    },
    createPost(title: string, shortDescription: string,
               content: string, blogId:
               string, blog: TBlog | null): TPost {    // post
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
    findPostById(postId: string): TPost | null {   // get, put, delete
        const post = db.posts.find(p => p.id === postId)
        if (post) return post
        else return null
    },
    updatePost(foundPost: TPost, title: string,
               shortDescription: string,
               content: string): TPost {      // put
        foundPost.title = title
        foundPost.shortDescription = shortDescription
        foundPost.content = content
        return foundPost
    },
    deletePostById(postId: string) {    // delete
        return db.posts = db.posts.filter(p => p.id !== postId)
    }
}