import {apiRequestCollection} from "../db/db";


export const ipRepository = {
    async countIpAndUrl(ip: string, url: string, date: Date): Promise<number | null> {
        return await apiRequestCollection.countDocuments({ $and: [ { ip }, { url }, { date: { $gte: date } } ]})
    },

    async addIpAndUrl(ip: string, url: string, date: Date) {
        await apiRequestCollection.insertOne({ip, url, date})
    }
}