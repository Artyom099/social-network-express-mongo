import {PostViewModel} from "../types/types";
import {PostModel} from "../shemas/posts-schema";


export const postsRepository = {
    async createPost(createdPost: PostViewModel): Promise<PostViewModel> {
        await PostModel.insertMany(createdPost)
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
        return PostModel.findOne({ id }, {_id: 0});
    },

    async updatePostById(id: string, title: string, shortDescription: string, content: string): Promise<boolean> {
        const result = await PostModel.updateOne({ id }, { title, shortDescription, content })
        return result.matchedCount === 1
    },

    async deletePostById(id: string) {
        const result = await PostModel.deleteOne({ id })
        return result.deletedCount === 1
    }
}