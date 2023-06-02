import mongoose from "mongoose";
import {WithId} from "mongodb";
import {PostViewModel} from "../types/types";


export const PostsSchema = new mongoose.Schema<WithId<PostViewModel>>({
    id: { type: String, require: true },
    title: { type: String, require: true },
    shortDescription: { type: String, require: true },
    content: { type: String, require: true },
    blogId: { type: String, require: true },
    blogName: { type: String, require: true },
    createdAt: { type: String, require: true }
})
export const PostModel = mongoose.model<PostViewModel>('posts', PostsSchema)