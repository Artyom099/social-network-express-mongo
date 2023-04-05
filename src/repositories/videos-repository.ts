import {db} from "../db/db";
import {TVideo} from "../types";


export const videosRepository = {
    findVideos() {
        return db.videos
    },
    createVideos(createdVideo: TVideo) {
        return db.videos.push(createdVideo)
    }
}