import {IPDBType} from "../types/types";
import {ipCollection} from "../db/db";


export const ipRepository = {
    async findIpAndUrl(ip: string, url: string): Promise<IPDBType | null> {
        const foundIp = ipCollection.findOne({ $and: [ {'ip': ip}, {'url': url} ]})
        if (foundIp) return foundIp
        else return null
    }
}