import {db} from "../db/db";
import {TVideo} from "../types";


export const videosRepository = {
    findVideos() {
        return db.videos
    },
    createVideos(title: string, author: string,
                 availableResolutions: string[]): TVideo {
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
    findVideoById(videoId: string): TVideo | null{
        const video = db.videos.find(v => v.id === videoId)
        if (video) return video
        else return null
    },
    updateVideo(foundVideo: TVideo, title: string,
                author: string, availableResolutions: string[],
                canBeDownloaded: boolean,
                minAgeRestriction: number | null,
                publicationDate: string): TVideo {   // put
        foundVideo.title = title
        foundVideo.author = author
        foundVideo.availableResolutions = availableResolutions
        foundVideo.canBeDownloaded = canBeDownloaded
        foundVideo.minAgeRestriction = minAgeRestriction
        foundVideo.publicationDate = publicationDate
        return foundVideo
    },
    deleteVideoById(videoId: string) {    // delete
        return db.videos = db.videos.filter(v => v.id !== videoId)
    }
}