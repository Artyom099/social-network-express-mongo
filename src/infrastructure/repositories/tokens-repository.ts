import {expiredTokenCollection} from "../db/db";
import {ExpiredTokenDBModel} from "../../types";


export const tokensRepository = {
    async addTokenToBlackList(token: string) {
        await expiredTokenCollection.insertOne({token: token})
    },

    async checkTokenInBlackList(token: ExpiredTokenDBModel): Promise<true | null> {
        const tokenIsExpired = await expiredTokenCollection.findOne({token: token})
        if (tokenIsExpired) return true
        else return null
    }
}