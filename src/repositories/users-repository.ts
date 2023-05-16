import {ExpiredTokenDBType, TUser, UserAccountDBType} from "../types/types";
import {expiredTokenCollection, userCollection} from "../db/db";


export const usersRepository = {
    async createUser(newUser: UserAccountDBType): Promise<TUser> {
        await userCollection.insertOne(newUser)
        return {
            id: newUser.id,
            login: newUser.accountData.login,
            email: newUser.accountData.email,
            createdAt: newUser.accountData.createdAt
        }
    },

    async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserAccountDBType | null> {
        const user = await userCollection.findOne({ $or: [ {'accountData.email': loginOrEmail}, {'accountData.login': loginOrEmail} ]})
        if (user) return user
        else return null
    },

    async findUserById(userId: string): Promise<TUser | null> {
        // todo убрать projection
        const user = await userCollection.findOne({id: userId}, {projection: {_id: false}})
        if (user) return {
            id: user.id,
            login: user.accountData.login,
            email: user.accountData.email,
            createdAt: user.accountData.createdAt
        }
        else return null
    },

    async deleteUserById(userId: string) {
        return await userCollection.deleteOne({id: userId})
    },

    async findUserByConfirmationCode(code: string): Promise<UserAccountDBType | null> {
        const user = await userCollection.findOne({'emailConfirmation.confirmationCode': code})
        if (user) return user
        else return null
    },

    async updateEmailConfirmation(userId: string) {
        await userCollection.updateOne({id: userId}, {$set: {'emailConfirmation.isConfirmed': true}})
    },

    async updateConfirmationCode(email: string, code: string) {
        await userCollection.updateOne({'accountData.email': email}, {$set: {'emailConfirmation.confirmationCode': code}})
    },

    async addTokenToBlackList(token: string) {
    await expiredTokenCollection.insertOne({token: token})
    },

    async checkTokenInBlackList(token: ExpiredTokenDBType): Promise<true | null> {
        const tokenIsExpired = await expiredTokenCollection.findOne({token: token})
        if (tokenIsExpired) return true
        else return null
    }
}