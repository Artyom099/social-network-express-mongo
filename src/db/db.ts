import {
    CommentBDType, DeviceDBType,
    ExpiredTokenDBType,
    IPDBType,
    TBlog,
    TPost,
    TVideo,
    UserAccountDBType
} from "../types/types"
import {MongoClient} from 'mongodb'
import dotenv from 'dotenv'
import * as mongoose from "mongoose";
import {BlogSchema} from "../shemas/blogs-schemas";


dotenv.config()
const mongoUri = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'
if (!mongoUri) throw new Error('UR doesn\'t found')
const client = new MongoClient(mongoUri)

const dbName = 'home_works'
export const mongoURI2 = process.env.MONGO_URL || `mongodb://0.0.0.0:27017/${dbName}`

const database = client.db();
export const videoCollection = database.collection<TVideo>('videos')
export const blogCollection = database.collection<TBlog>('blogs')
export const postCollection = database.collection<TPost>('posts')
export const userCollection = database.collection<UserAccountDBType>('users')
export const commentCollection = database.collection<CommentBDType>('comments')
export const expiredTokenCollection = database.collection<ExpiredTokenDBType>('expiredTokens')
export const apiRequestCollection = database.collection<IPDBType>('ip')
export const devicesCollection = database.collection<DeviceDBType>('devices')

export const BlogModel = mongoose.model<TBlog>('blogs', BlogSchema)

export async function runDb() {
    try {
        await client.connect()
        await database.command({ ping: 1 })
        console.log('Connected successfully to mongo server')

        await mongoose.connect(mongoURI2)
        console.log('Mongoose is connected')

    } catch(e) {
        console.log('Can\'t connect to mongo server')
        await client.close()

        console.log('no connection')
        await mongoose.disconnect()
    }
}