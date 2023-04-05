import {db} from "../db/db";
import {TPost} from "../types";


export const postsRepository = {
    findPosts() {
        return db.posts
    },
    createPosts(createdPost: TPost) {
        return db.posts.push(createdPost)
    }
}