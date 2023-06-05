import {
    videoCollection,
    userCollection,
    expiredTokenCollection, apiRequestCollection, devicesCollection,
} from "../db/db";
import {BlogModel} from "../shemas/blogs-schema";
import {PostModel} from "../shemas/posts-schema";
import {CommentModel} from "../shemas/feedback-schema";


export const testsRepository = {
    async deleteAllData() {
        await Promise.all([
            videoCollection.deleteMany(),
            BlogModel.deleteMany(),
            PostModel.deleteMany(),
            userCollection.deleteMany(),
            CommentModel.deleteMany(),
            expiredTokenCollection.deleteMany(),
            apiRequestCollection.deleteMany(),
            devicesCollection.deleteMany(),
        ])
        return
    }
}