import {
    videoCollection,
    userCollection,
    expiredTokenCollection, apiRequestCollection, devicesCollection,
} from "../../infrastructure/db/db";
import {BlogModel} from "../blog/infrastructure/blogs-schema";
import {PostModel} from "../post/infrastructure/posts-schema";
import {CommentModel} from "../comments/infrasrtucture/comments-schema";


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