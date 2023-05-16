import {ExpiredTokenDBType} from "../types/types";
import {tokensRepository} from "../repositories/tokens-repository";


export const tokensService = {
    async addTokenToBlackList(token: string) {
        await tokensRepository.addTokenToBlackList(token)
    },

    async checkTokenInBlackList(token: ExpiredTokenDBType): Promise<true | null> {
        return await tokensRepository.checkTokenInBlackList(token)
    }
}