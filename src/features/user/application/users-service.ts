import bcrypt from 'bcrypt'
import {UserViewModel, UserAccountDBModel} from "../../../types";
import {userRepository} from "../infrastructure/user.repository";
import add from "date-fns/add";
import {randomUUID} from "crypto";


export const usersService = {
    async createUser(login: string, password: string, email: string) {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)

        const dto: UserAccountDBModel = {
            id: randomUUID().toString(),
            accountData: {
                login,
                email,
                passwordHash,
                passwordSalt,
                createdAt: new Date().toISOString()
            },
            emailConfirmation: {
                confirmationCode: randomUUID(),
                expirationDate: add(new Date, {minutes: 10}),
                isConfirmed: true
            },
            recoveryCode: null
        }
        return await userRepository.createUser(dto)
    },

    async checkCredentials(loginOrEmail: string, password: string): Promise<string | null> {
        const user = await userRepository.findUserByLoginOrEmail(loginOrEmail)
        if (!user) return null

        const passwordHash = await this._generateHash(password, user.accountData.passwordSalt)
        if (user.accountData.passwordHash === passwordHash) return user.id

        else return null
    },

    async _generateHash(password: string, salt: string) {
        return bcrypt.hash(password, salt)
    },

    async findUserById(userId: string): Promise<UserViewModel | null> {
        return userRepository.findUserById(userId)
    },

    async findUserByLoginOrEmail(LoginOrEmail: string): Promise<UserAccountDBModel | null> {
        return userRepository.findUserByLoginOrEmail(LoginOrEmail)
    },

    async deleteUserById(userId: string) {
        return userRepository.deleteUserById(userId)
    }
}