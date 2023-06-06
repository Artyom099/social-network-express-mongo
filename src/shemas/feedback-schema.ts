import mongoose from "mongoose";
import {WithId} from "mongodb";
import {CommentBDType} from "../types/types";
import {LikeStatus} from "../utils/constants";


export const CommentSchema = new mongoose.Schema<WithId<CommentBDType>>({
    id: { type: String, require: true },
    postId: { type: String, require: true },
    content: { type: String, require: true },
    commentatorInfo: {
        userId: { type: String, require: true },
        userLogin: { type: String, require: true }
    },
    createdAt: { type: String, require: true, default: new Date().toISOString },
    likesInfo: {
        likesCount: { type: Number, require: true, min: 0 },
        dislikesCount: { type: Number, require: true, min: 0 },
        statuses: {
            userId: { type: String, require: true },
            status: { type: LikeStatus, require: true, default: LikeStatus.None }
        } // { type: Array, default: [] }
    }
})
export const CommentModel = mongoose.model<CommentBDType>('comments', CommentSchema)