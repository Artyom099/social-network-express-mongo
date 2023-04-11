import {TBlog, TPost, TVideo} from "../types"
import {MongoClient} from 'mongodb'
import dotenv from 'dotenv'
dotenv.config()


const mongoUri = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'
const client = new MongoClient(mongoUri)


const database = client.db('network');
export const videoCollection = database.collection<TVideo>('videos')
export const blogCollection = database.collection<TBlog>('blogs')
export const postCollection = database.collection<TPost>('posts')

export async function runDb() {
    try {
        await client.connect()
        await database.command({ ping: 1 })
        console.log('Connected successfully to mongo server')
    } catch {
        console.log('Can\'t connect to mongo server')
        await client.close()
    }
}