import {videoCollection} from "../../infrastructure/db/db";
import {Result, VideoViewModel} from "../../types";
import {ResultCode} from "../../infrastructure/utils/enums";


export const videosRepository = {
    async getVideos(): Promise<VideoViewModel[]> {
        return videoCollection.find({}, {projection: {_id: false}}).toArray()
    },

    async createVideo(createdVideo: VideoViewModel): Promise<VideoViewModel> {
        await videoCollection.insertOne(createdVideo);

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

    async getVideo(videoId: string): Promise<VideoViewModel | null> {
        const video = await videoCollection.findOne({id: videoId}, {projection: {_id: false}});

        if (!video) return null
        else return video
    },

    async updateVideo(videoId: string, title: string, author: string, availableResolutions: string[],
                      canBeDownloaded: boolean, minAgeRestriction: number | null,
                      publicationDate: string): Promise<Result<boolean>> {
        const updatedResult = await videoCollection.updateOne({id: videoId},
            { $set: {title: title, author: author, availableResolutions: availableResolutions,
                canBeDownloaded: canBeDownloaded, minAgeRestriction: minAgeRestriction, publicationDate: publicationDate}});

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

    async deleteVideo(id: string) {
        return videoCollection.deleteOne({ id })
    }
}