import {videoCollection, blogCollection, postCollection, userCollection} from "../db/db";


export const testsRepository = {
    async deleteAllData() {
        await videoCollection.deleteMany()
        await blogCollection.deleteMany()
        await postCollection.deleteMany()
        await userCollection.deleteMany()
        return
    }
}