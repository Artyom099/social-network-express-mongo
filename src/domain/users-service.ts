import bcrypt from 'bcrypt'
import {TUser, UserAccountDBType} from "../types/types";
import {usersRepository} from "../repositories/users-repository";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";


export const usersService = {
    async createUser(login: string, password: string, email: string) {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)
        const newUser: UserAccountDBType = {
            id: uuidv4().toString(),
            accountData: {
                login,
                email,
                passwordHash,
                passwordSalt,
                createdAt: new Date().toISOString()
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date, {minutes: 10}),
                isConfirmed: true
            },
            tokensBlackList: []
        }
        return await usersRepository.createUser(newUser)
    },

    async checkCredentials(loginOrEmail: string, password: string): Promise<string | null> {
        const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail)
        if (!user) return null
        const passwordHash = await this._generateHash(password, user.accountData.passwordSalt)
        if (user.accountData.passwordHash === passwordHash) return user.id
        else return null
    },

    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt)
    },

    async findUserById(userId: string): Promise<TUser | null> {    // get, put, delete
        return await usersRepository.findUserById(userId)
    },

    async findUserByLoginOrEmail(LoginOrEmail: string): Promise<UserAccountDBType | null> {
        return await usersRepository.findUserByLoginOrEmail(LoginOrEmail)
    },

    async deleteUserById(userId: string) {
        return await usersRepository.deleteUserById(userId)
    }
}