import {db} from "../db/db";
import {TBlog, TVideo} from "../types";


export const videosRepository = {
    findVideos() {
        return db.videos
    },
    createVideos(createdVideo: TVideo) {
        db.videos.push(createdVideo)
        return createdVideo
    },
    findVideoById(videoId: string): TVideo | null{
        const video = db.videos.find(v => v.id === videoId)
        if (video) return video
        else return null
    },
    updateVideo(foundVideo: TVideo): TVideo {      // put
        // todo Сделать ли здесь как в блогах?
        return foundVideo
    },
    deleteVideoById(videoId: string) {    // delete
        return db.videos = db.videos.filter(v => v.id !== videoId)
    }

}