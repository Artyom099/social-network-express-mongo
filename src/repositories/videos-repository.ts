import {client, db} from "../db/db";
import {TVideo} from "../types";


export const videosRepository = {
    async findVideos(): Promise<TVideo[]> {
        //client.db('network').collection<TVideo[]>('videos').toArray
        return db.videos
    },
    async createVideos(title: string, author: string,
                 availableResolutions: string[]): Promise<TVideo> {
        const dateNow = new Date()
        const createdVideo: TVideo = {
            id: (+dateNow).toString(),
            title,
            author,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: dateNow.toISOString(),
            publicationDate: new Date(dateNow.setDate(dateNow.getDate() + 1)).toISOString(),
            availableResolutions
        }
        db.videos.push(createdVideo)
        return createdVideo
    },
    async findVideoById(videoId: string): Promise<TVideo | null> {
        const video = await db.videos.find(v => v.id === videoId)
        if (video) return video
        else return null
    },
    async updateVideo(foundVideo: TVideo, title: string,
                author: string, availableResolutions: string[],
                canBeDownloaded: boolean,
                minAgeRestriction: number | null,
                publicationDate: string): Promise<TVideo> {   // put
        foundVideo.title = title
        foundVideo.author = author
        foundVideo.availableResolutions = availableResolutions
        foundVideo.canBeDownloaded = canBeDownloaded
        foundVideo.minAgeRestriction = minAgeRestriction
        foundVideo.publicationDate = publicationDate
        return foundVideo
    },
    async deleteVideoById(videoId: string): Promise<TVideo[]> {    // delete
        return db.videos = db.videos.filter(v => v.id !== videoId)
    }
}