import {videoCollection} from "../db/db";
import {TVideo} from "../types";
import {Result, ResultCode} from "../utils";


export const videosRepository = {
    async findVideos(): Promise<TVideo[]> {
        return await videoCollection.find({}).toArray();
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
        await videoCollection.insertOne(createdVideo)
        return createdVideo
    },
    async findVideoById(videoId: string): Promise<TVideo | null> {
        const video = await videoCollection.findOne({id: videoId})
        if (video) return video
        else return null
    },
    async updateVideo(videoId: string, title: string,
                author: string, availableResolutions: string[],
                canBeDownloaded: boolean, minAgeRestriction: number | null,
                publicationDate: string): Promise<Result<boolean>> {   // put
        const updatedResult = await videoCollection.updateOne({id: videoId},
            { $set: {title: title, author: author, availableResolutions: availableResolutions,
                canBeDownloaded: canBeDownloaded, minAgeRestriction: minAgeRestriction, publicationDate: publicationDate}})

        if(updatedResult.matchedCount < 1 ) {
            return {
                data: false,
                code: ResultCode.NotFound
            }
        } else {
            return {
                data: true,
                code: ResultCode.Success
            }
        }
    },
    async deleteVideoById(videoId: string) {    // delete
        return await videoCollection.deleteOne({id: videoId})
    }
}