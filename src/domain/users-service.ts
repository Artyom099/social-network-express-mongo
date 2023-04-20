import bcrypt from 'bcrypt'
import {usersRepository} from "../repositories/users-repository";
import {TUser, UserDBType} from "../types";

export const usersService = {
    async findUsersAndSort(searchEmailTerm: string, searchLoginTerm: string, pageNumber: number, pageSize: number, sortBy: string,
                  sortDirection: string) {
        return await usersRepository.findExistUsers(pageNumber, pageSize, sortBy, sortDirection)
    },

    async createUser(login: string, password: string, email: string) {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)
        const dateNow = new Date()
        const newUser: UserDBType = {
            id: (+dateNow).toString(),
            login: login,
            email,
            passwordHash,
            passwordSalt,
            createdAt: dateNow.toISOString()
        }
        return await usersRepository.createUser(newUser)
    },

    async checkCredentials(loginOrEmail: string, password: string) {
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) return false
        const passwordHash = await this._generateHash(password, user.passwordSalt)
        return user.passwordHash === passwordHash;
    },

    async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        console.log('hash: ' + hash)
        return hash
    },

    async findUserById(userId: string): Promise<TUser | null> {    // get, put, delete
        return await usersRepository.findUserById(userId)
    },

    async deleteUser(userId: string) {
        return await usersRepository.deleteUser(userId)
    }
}