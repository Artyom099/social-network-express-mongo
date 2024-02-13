import {Result, VideoViewModel} from "../../infrastructure/types/types";
import {videosRepository} from "./videos-repository";
import {randomUUID} from "crypto";


export const videosService = {
    async findVideos(): Promise<VideoViewModel[]> {
        return videosRepository.findExistVideos()
    },

    async createVideo(title: string, author: string, availableResolutions: string[]): Promise<VideoViewModel> {
        const dateNow = new Date()
        const createdVideo: VideoViewModel = {
            id: randomUUID().toString(),
            title,
            author,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: dateNow.toISOString(),
            publicationDate: new Date(dateNow.setDate(dateNow.getDate() + 1)).toISOString(),
            availableResolutions
        }
        return videosRepository.createVideo(createdVideo)
    },

    async findVideoById(videoId: string): Promise<VideoViewModel | null> {
        return await videosRepository.findVideoById(videoId)
    },

    async updateVideo(videoId: string, title: string, author: string, availableResolutions: string[],
                      canBeDownloaded: boolean, minAgeRestriction: number | null,
                      publicationDate: string): Promise<Result<boolean>> {   // put
        return videosRepository.updateVideoById(videoId, title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate)
    },

    async deleteVideoById(videoId: string) {
        return videosRepository.deleteVideoById(videoId)
    }
}