import mongoose from "mongoose";
import {WithId} from "mongodb";
import {BlogViewModel} from "../types/types";


export const BlogSchema = new mongoose.Schema<WithId<BlogViewModel>>({
    id: { type: String, require: true },
    name: { type: String, require: true },
    description: { type: String, require: true },
    websiteUrl: { type: String, require: true },
    createdAt: { type: String },
    isMembership: { type: Boolean }
})
export const BlogModel = mongoose.model<BlogViewModel>('blogs', BlogSchema)