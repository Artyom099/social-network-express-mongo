import {IPDBType} from "../types/types";
import {ipRepository} from "../repositories/ip-repository";


export const ipService = {
    async findIpAndUrl(ip: string, url: string): Promise<IPDBType | null> {
        return ipRepository.findIpAndUrl(ip, url)
    }
}