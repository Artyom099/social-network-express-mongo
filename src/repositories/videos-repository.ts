import {HTTP_STATUS} from "../utils";
import {db} from "../db/db";


export const videosRepository = {
    findVideos() {
        res.status(HTTP_STATUS.OK_200).send(db.videos)
    }
}