import {db} from "../db/db";
import {TPost} from "../types";


export const postsRepository = {
    findExistPosts() {
        return db.posts
    },
    createPost(createdPost: TPost) {
        return db.posts.push(createdPost)
    }
}