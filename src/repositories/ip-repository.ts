import {apiRequestCollection} from "../db/db";


export const ipRepository = {
    async countIpAndUrl(ip: string, url: string, date: string): Promise<number | null> {
        const countIp = await apiRequestCollection.countDocuments({ $and: [ {ip: ip}, {url: url}, {date: {$gt: date}} ]})
        if (countIp) return countIp
        else return null
    },

    async addIpAndUrl(ip: string, url: string, date: string) {
        await apiRequestCollection.insertOne({IP: ip, URL: url, date: date})
    }
}