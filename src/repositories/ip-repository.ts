import {ipCollection} from "../db/db";


export const ipRepository = {
    async countIpAndUrl(ip: string, url: string, date: Date): Promise<number | null> {
        const countIp = ipCollection.countDocuments({ $and: [ {'ip': ip}, {'url': url}, {'date': date >= date} ]})
        if (countIp) return countIp
        else return null
    }
}