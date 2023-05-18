import {
    videoCollection,
    blogCollection,
    postCollection,
    userCollection,
    commentCollection, expiredTokenCollection, ipCollection,
} from "../db/db";


export const testsRepository = {
    async deleteAllData() {
        await videoCollection.deleteMany()
        await blogCollection.deleteMany()
        await postCollection.deleteMany()
        await userCollection.deleteMany()
        await commentCollection.deleteMany()
        await expiredTokenCollection.deleteMany()
        await ipCollection.deleteMany()
        return
    }
}