import {postCollection} from "../db/db";
import {TBlog, TPost} from "../types";


export const postsRepository = {
    async findExistPosts(): Promise<TPost[]> {      // get
        return await postCollection.find({}).toArray();
    },
    async createPost(title: string, shortDescription: string, content: string,
                     blogId: string, blog: TBlog | null): Promise<TPost> {    // post
        const createdPost: TPost = {
            id: (+new Date()).toString(),
            title,
            shortDescription,
            content,
            blogId,
            blogName: blog!.name
        }
        await postCollection.insertOne(createdPost)
        return createdPost
    },
    async findPostById(postId: string): Promise<TPost | null> {   // get, put, delete
        const post = await postCollection.findOne({id: postId})
        if (post) return post
        else return null
    },
    async updatePost(postId: string, title: string,
               shortDescription: string,
               content: string): Promise<TPost> | TPost {      // put
        return await postCollection.updateOne({id: postId},
        { $set: {title: title, shortDescription: shortDescription, content: content}})
    },
    async deletePostById(postId: string) {    // delete
        return await postCollection.deleteOne({id: postId})
    }
}