import {TUser, UserAccountDBType, UserDBType} from "../types/types";
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

    async findUserByLoginOrEmail(loginOrEmail: string) {
        const user = await userCollection.findOne({ $or: [ {email: loginOrEmail}, {login: loginOrEmail} ]})
        if (user) return user
        else return null
    },

    async findUserById(userId: string) {
        const user = await userCollection.findOne({id: userId}, {projection: {_id: false}})
        if (user) return user
        else return null
    },

    async deleteUser(userId: string) {
        return await userCollection.deleteOne({id: userId})
    }
}