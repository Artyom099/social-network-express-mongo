import {expiredTokenCollection} from "../db/db";
import {ExpiredTokenDBType} from "../types/types";


export const tokensRepository = {
    async addTokenToBlackList(token: string) {
        await expiredTokenCollection.insertOne({token: token})
    },

    async checkTokenInBlackList(token: ExpiredTokenDBType): Promise<true | null> {
        const tokenIsExpired = await expiredTokenCollection.findOne({token: token})
        if (tokenIsExpired) return true
        else return null
    }
}