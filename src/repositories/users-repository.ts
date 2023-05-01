import {TUser, UserDBType} from "../types/types";
import {userCollection} from "../db/db";


export const usersRepository = {
    async createUser(newUser: UserDBType): Promise<TUser> {
        await userCollection.insertOne(newUser)
        return {
            id: newUser.id,
            login: newUser.login,
            email: newUser.email,
            createdAt: newUser.createdAt
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