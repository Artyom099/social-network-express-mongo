import {TUser, UserAccountDBType} from "../types/types";
import {userCollection} from "../db/db";


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
        const user = await userCollection.findOne({id: userId}, {projection: {_id: false}})
        if (user) return {
            id: user.id,
            login: user.accountData.login,
            email: user.accountData.email,
            createdAt: user.accountData.createdAt
        }
        else return null
    },

    async deleteUser(userId: string) {
        return await userCollection.deleteOne({id: userId})
    },

    async updateConfirmation(userId: string) {
        await userCollection.updateOne({id: userId}, {$set: {'emailConfirmation.isConfirmed': true}})
    }
}