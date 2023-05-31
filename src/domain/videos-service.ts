import {Result, VideoViewModel} from "../types/types";
import {videosRepository} from "../repositories/videos-repository";


export const videosService = {
    async findVideos(): Promise<VideoViewModel[]> {
        return await videosRepository.findExistVideos()
    },

    async createVideo(title: string, author: string, availableResolutions: string[]): Promise<VideoViewModel> {
        const dateNow = new Date()
        const createdVideo: VideoViewModel = {
            id: (+dateNow).toString(),
            title,
            author,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: dateNow.toISOString(),
            publicationDate: new Date(dateNow.setDate(dateNow.getDate() + 1)).toISOString(),
            availableResolutions
        }
        return await videosRepository.createVideo(createdVideo)
    },

    async findVideoById(videoId: string): Promise<VideoViewModel | null> {
        return await videosRepository.findVideoById(videoId)
    },

    async updateVideo(videoId: string, title: string, author: string, availableResolutions: string[],
                      canBeDownloaded: boolean, minAgeRestriction: number | null,
                      publicationDate: string): Promise<Result<boolean>> {   // put
        return await videosRepository.updateVideoById(videoId, title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate)
    },

    async deleteVideoById(videoId: string) {    // delete
        return await videosRepository.deleteVideoById(videoId)
    }
}