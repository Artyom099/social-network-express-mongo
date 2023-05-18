import {ipRepository} from "../repositories/ip-repository";


export const ipService = {
    async countIpAndUrl(ip: string, url: string, date: string): Promise<number | null> {
        return await ipRepository.countIpAndUrl(ip, url, date)
    },

    async addIpAndUrl(ip: string, url: string, date: string) {
        return await ipRepository.addIpAndUrl(ip, url, date)
    }
}