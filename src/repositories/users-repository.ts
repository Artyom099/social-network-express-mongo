import {OutputModel, TUser, UserDBType} from "../types";
import {Sort} from "mongodb";
import {userCollection} from "../db/db";


export const usersRepository = {
    async findExistUsers(pageNumber: number, pageSize: number, sortBy: string,
                         sortDirection: string): Promise<OutputModel<TUser[]>> {
        let sortNum: Sort = -1
        if (sortDirection === 'asc') sortNum = 1     // 1 - возрстание
        if (sortDirection === 'desc') sortNum = -1   // -1 - убывание

        const totalCount: number = await userCollection.countDocuments()
        const sortedUsers: TUser[] = await userCollection.find({},{projection: {_id: false, passwordHash: false, passwordSalt: false}})
            .sort({[sortBy]: sortNum}).skip((pageNumber - 1) * pageSize).limit(pageSize).toArray()
        return {
            pagesCount: Math.ceil(totalCount / pageSize),    // общее количество страниц
            page: pageNumber,                                   // текущая страница
            pageSize,                                           // количество блогов на странице
            totalCount,                                         // общее количество блогов
            items: sortedUsers
        }
    },

    async createUser(newUser: UserDBType): Promise<TUser> {
        await userCollection.insertOne(newUser)
        return {
            id: newUser.id,
            login: newUser.login,
            email: newUser.email,
            createdAt: newUser.createdAt
        }
    },

    async findByLoginOrEmail(loginOrEmail: string) {
        return await userCollection.findOne({ $or: [ {email: loginOrEmail}, {login: loginOrEmail} ]})
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