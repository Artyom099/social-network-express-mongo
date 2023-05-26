import mongoose from "mongoose";
import {WithId} from "mongodb";
import {TBlog} from "../types/types";


export const BlogSchema = new mongoose.Schema<WithId<TBlog>>({
    id: { type: String, require: true },
    name: { type: String, require: true },
    description: { type: String, require: true },
    websiteUrl: { type: String, require: true },
    createdAt: { type: String },
    isMembership: { type: Boolean }
})