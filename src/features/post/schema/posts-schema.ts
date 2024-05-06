import mongoose from "mongoose";
import {WithId} from "mongodb";
import {PostDBModel} from "../../../types";
import {LikeStatus} from "../../../infrastructure/utils/enums";

export const LikeStatusesSchema = new mongoose.Schema<{addedAt: Date, userId: string, status: LikeStatus, login: string}>( {
    addedAt: { type: Date, require: true },
    userId: { type: String, require: true },
    status: { type: String, enum: LikeStatus, require: true },
    login: { type: String, require: true }
})

export const PostsSchema = new mongoose.Schema<WithId<PostDBModel>>({
    id: { type: String, require: true },
    title: { type: String, require: true },
    shortDescription: { type: String, require: true },
    content: { type: String, require: true },
    blogId: { type: String, require: true },
    blogName: { type: String, require: true },
    createdAt: { type: String, require: true },
    extendedLikesInfo: {
        likesCount: { type: Number, require: true, min: 0 },
        dislikesCount: { type: Number, require: true, min: 0 },
        statuses: { type: [LikeStatusesSchema]  }
    }
})
export const PostModel = mongoose.model<PostDBModel>('posts', PostsSchema)