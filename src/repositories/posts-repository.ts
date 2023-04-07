import {db} from "../db/db";
import {TPost} from "../types";


export const postsRepository = {
    findExistPosts() {                  // get
        return db.posts
    },
    createPost(createdPost: TPost) {    // post
        db.posts.push(createdPost)
        return createdPost
    },
    findPostById(postId: string) {      // get, put, delete
        return db.posts.find(p => p.id === postId)
    },
    updatePost(foundPost: TPost, title: string, shortDescription: string, content: string) {      // put
        foundPost.title = title
        foundPost.shortDescription = shortDescription
        foundPost.content = content
        return foundPost
    },
    deletePostById(postId: string) {    // delete
        return db.posts = db.posts.filter(p => p.id !== postId)
    }
}