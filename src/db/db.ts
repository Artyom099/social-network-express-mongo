import {TDataBase} from "../types"
import {MongoClient} from 'mongodb'

export const db: TDataBase = {
    videos: [],
    blogs: [],
    posts: []
}

const mongoUri = process.env.mongoUri || 'mongodb://0.0.0.0:27017'
export const client = new MongoClient(mongoUri)

const database = client.db('network');
export const videoCollection = database.collection('videos')
export const blogCollection = database.collection('blogs')
export const postCollection = database.collection('posts')

export async function runDb() {
    try {
        await client.connect()
        await client.db('network').command({ ping: 1 })
        console.log('Connected successfully to mongo server')
    } catch {
        console.log('Can\'t connect to mongo server')
        await client.close()
    }
}