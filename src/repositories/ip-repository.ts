import {apiRequestCollection} from "../db/db";


export const ipRepository = {
    async countIpAndUrl(ip: string, url: string, date: string): Promise<number | null> {
        const countIp = await apiRequestCollection.countDocuments({ $and: [ {ip: ip}, {url: url}, {date: {$gt: date}} ]})
        if (countIp) return countIp
        else return null
    }
}