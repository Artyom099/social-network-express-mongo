import {OutputModel, TUser} from "../types";
import {Sort} from "mongodb";


export const usersRepository = {
    async findExistUsers(pageNumber: number, pageSize: number, sortBy: string,
                         sortDirection: string): Promise<OutputModel<TUser[]>> {
        let sortNum: Sort = -1
        if (sortDirection === 'asc') sortNum = 1     // 1 - возрстание
        if (sortDirection === 'desc') sortNum = -1   // -1 - убывание

        const totalCount: number = await userCollection.countDocuments()
        const sortedUsers: TUser[] = await userCollection.find({},{projection: {_id: false}})
            .sort({[sortBy]: sortNum}).skip((pageNumber - 1) * pageSize).limit(pageSize).toArray()
        return {
            pagesCount: Math.ceil(totalCount / pageSize),    // общее количество страниц
            page: pageNumber,                                   // текущая страница
            pageSize,                                           // количество блогов на странице
            totalCount,                                         // общее количество блогов
            items: sortedUsers
        }
    },

    async createUser(newUser): Promise<TUser> {

    },

    async findByLoginOrEmail(loginOrEmail: string) {
        const user = await userCollection.findOne({ $or: [ {email: loginOrEmail}, {login: loginOrEmail} ]})
        return user
    }
}