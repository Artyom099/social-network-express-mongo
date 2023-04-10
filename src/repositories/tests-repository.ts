import {db} from "../db/db";


export const testsRepository = {
    async deleteAllData() {
        db.videos = []
        db.blogs = []
        db.posts = []
        return
    }
}