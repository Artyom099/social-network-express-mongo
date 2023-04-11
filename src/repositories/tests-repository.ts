import {videoCollection, blogCollection, postCollection} from "../db/db";


export const testsRepository = {
    async deleteAllData() {
        await videoCollection.deleteMany()
        await blogCollection.deleteMany()
        await postCollection.deleteMany()
        return
    }
}