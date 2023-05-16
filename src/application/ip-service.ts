import {ipRepository} from "../repositories/ip-repository";


export const ipService = {
    async countIpAndUrl(ip: string, url: string, date: Date): Promise<number | null> {
        return ipRepository.countIpAndUrl(ip, url, date)
    }
}