import bcrypt from "bcrypt";
import {expiredTokenType, TUser, UserAccountDBType} from "../types/types";
import {usersRepository} from "../repositories/users-repository";
import {usersService} from "./users-service";
import {emailManager} from "../managers/email-manager";
import {v4 as uuidv4} from 'uuid'
import add from 'date-fns/add'


export const authService = {
    async createUser(login: string, password: string, email: string): Promise<TUser | null> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await usersService._generateHash(password, passwordSalt)
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
                isConfirmed: false
            }
        }
        const createResult = await usersRepository.createUser(newUser)
        try {
            await emailManager.sendEmailConfirmationMessage(email, newUser.emailConfirmation.confirmationCode)
        } catch (error) {
            await usersService.deleteUserById(newUser.id)
            return null
        }
        return createResult
    },

    async checkConfirmationCode(code: string): Promise<boolean> {
        // проверка кода на правильность, срок жизни и повторное использование
        const user = await usersRepository.findUserByConfirmationCode(code)
        if (user && !user.emailConfirmation.isConfirmed &&
            user.emailConfirmation.confirmationCode === code &&
            user.emailConfirmation.expirationDate > new Date()) {
            await usersRepository.updateEmailConfirmation(user.id)
            return true
        } else {
            return false
        }
    },

    async updateConfirmationCode(email: string): Promise<string> {
        const newConfirmationCode = uuidv4()
        await usersRepository.updateConfirmationCode(email, newConfirmationCode)
        return newConfirmationCode
    },

    async addTokenToBlackList(token: expiredTokenType) {
        await usersRepository.addTokenToBlackList(token)
    },

    async checkTokenInBlackList(token: expiredTokenType): Promise<true | null> {
        return await usersRepository.checkTokenInBlackList(token)
    }
}