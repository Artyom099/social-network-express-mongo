import {apiRequestCollection} from "../db/db";


export const ipRepository = {
    async countIpAndUrl(ip: string, url: string, date: Date): Promise<number | null> {
        const countIp = apiRequestCollection.countDocuments({ $and: [ {'ip': ip}, {'url': url}, {'date': date >= date} ]})
        // todo проверить {'date': date >= date}
        if (countIp) return countIp
        else return null
    }
}