import {Result, VideoViewModel} from "../../types";
import {videosRepository} from "./videos-repository";
import {randomUUID} from "crypto";


export const videosService = {
    async getVideos(): Promise<VideoViewModel[]> {
        return videosRepository.getVideos()
    },

    async createVideo(title: string, author: string, availableResolutions: string[]): Promise<VideoViewModel> {
        const dateNow = new Date()
        const dto: VideoViewModel = {
            id: randomUUID().toString(),
            title,
            author,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: dateNow.toISOString(),
            publicationDate: new Date(dateNow.setDate(dateNow.getDate() + 1)).toISOString(),
            availableResolutions
        }
        return videosRepository.createVideo(dto)
    },

    async getVideo(videoId: string): Promise<VideoViewModel | null> {
        return await videosRepository.getVideo(videoId)
    },

    async updateVideo(videoId: string, title: string, author: string, availableResolutions: string[],
                      canBeDownloaded: boolean, minAgeRestriction: number | null,
                      publicationDate: string): Promise<Result<boolean>> {   // put
        return videosRepository.updateVideo(videoId, title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate)
    },

    async deleteVideo(videoId: string) {
        return videosRepository.deleteVideo(videoId)
    }
}