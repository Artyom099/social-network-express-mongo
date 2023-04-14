import {videoCollection} from "../db/db";
import {TVideo} from "../types";
import {Result, ResultCode} from "../utils";


export const videosRepository = {
    async findExistVideos(): Promise<TVideo[]> {
        return await videoCollection.find({}, {projection: {_id: false}}).toArray()
    },
    async createVideo(createdVideo: TVideo): Promise<TVideo> {
        await videoCollection.insertOne(createdVideo)
        return {
            id: createdVideo.id,
            title: createdVideo.title,
            author: createdVideo.author,
            canBeDownloaded: createdVideo.canBeDownloaded,
            minAgeRestriction: createdVideo.minAgeRestriction,
            createdAt: createdVideo.createdAt,
            publicationDate: createdVideo.publicationDate,
            availableResolutions: createdVideo.availableResolutions
        }
    },
    async findVideoById(videoId: number): Promise<TVideo | null> {
        const video = await videoCollection.findOne({id: videoId}, {projection: {_id: false}})
        if (video) return video
        else return null
    },
    async updateVideoById(videoId: number, title: string, author: string, availableResolutions: string[],
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
    async deleteVideoById(videoId: number) {    // delete
        return await videoCollection.deleteOne({id: videoId})
    }
}