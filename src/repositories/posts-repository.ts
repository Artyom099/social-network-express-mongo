import {postCollection} from "../db/db";
import {PostViewModel} from "../types/types";


export const postsRepository = {
    async createPost(createdPost: PostViewModel): Promise<PostViewModel> {
        await postCollection.insertOne(createdPost)
        return {
            id: createdPost.id,
            title: createdPost.title,
            shortDescription: createdPost.shortDescription,
            content: createdPost.content,
            blogId: createdPost.blogId,
            blogName: createdPost.blogName,
            createdAt: createdPost.createdAt
        }
    },

    async findPostById(id: string): Promise<PostViewModel | null> {
        const post = await postCollection.findOne({ id }, {projection: {_id: 0}})
        if (post) return post
        else return null
    },

    async updatePostById(id: string, title: string, shortDescription: string, content: string): Promise<boolean> {
        const updatedResult = await postCollection.updateOne({ id },
            {$set: {title: title, shortDescription: shortDescription, content: content}})
        return updatedResult.matchedCount === 1
    },

    async deletePostById(id: string) {
        return await postCollection.deleteOne({ id })
    }
}