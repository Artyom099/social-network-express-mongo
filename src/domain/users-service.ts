import bcrypt from 'bcrypt'
import {usersRepository} from "../repositories/users-repository";
import {ObjectId} from "mongodb";
import {UserDBType} from "../types";

export const usersService = {
    async findUsersAndSort(searchEmailTerm: string, searchLoginTerm: string, pageNumber: number, pageSize: number, sortBy: string,
                  sortDirection: string) {
        return await usersRepository.findExistUsers(pageNumber, pageSize, sortBy, sortDirection)
    },

    async createUser(login: string, password: string, email: string) {
        const passwordSalt = await bcrypt.getSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)
        const newUser: UserDBType = {
            id: new ObjectId(),
            userName: login,
            email,
            passwordHash,
            passwordSalt,
            createdAt: new Date().toISOString()
        }
        return await usersRepository.createUser(newUser)
    },

    async checkCredentials(loginOrEmail: string, password: string) {
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) return false
        const passwordHash = await this._generateHash(password, user.passwordSalt)
        if (user.passwordHash !== passwordHash) return false
        else return true
    },

    async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        console.log('hash: ' + hash)
        return hash
    }
}