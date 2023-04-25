import bcrypt from 'bcrypt'
import {TUser, UserDBType} from "../types";
import {usersRepository} from "../repositories/users-repository";


export const usersService = {
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
        const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail)
        if (!user) return false
        const passwordHash = await this._generateHash(password, user.passwordSalt)
        if (user.passwordHash === passwordHash) return user

    },

    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt)
    },

    async findUserById(userId: string): Promise<TUser | null> {    // get, put, delete
        return await usersRepository.findUserById(userId)
    },

    async deleteUser(userId: string) {
        return await usersRepository.deleteUser(userId)
    }
}