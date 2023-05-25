import {
    videoCollection,
    blogCollection,
    postCollection,
    userCollection,
    commentCollection, expiredTokenCollection, apiRequestCollection, devicesCollection,
} from "../db/db";


export const testsRepository = {
    async deleteAllData() {
        await Promise.all([
            videoCollection.deleteMany(),
            blogCollection.deleteMany(),
            postCollection.deleteMany(),
            userCollection.deleteMany(),
            commentCollection.deleteMany(),
            expiredTokenCollection.deleteMany(),
            apiRequestCollection.deleteMany(),
            devicesCollection.deleteMany(),
        ])
        return
    }
}