import bcrypt from "bcrypt";
import {TUser, UserAccountDBType} from "../types/types";
import {usersRepository} from "../repositories/users-repository";
import {usersService} from "./users-service";
import {emailManager} from "../managers/email-manager";
import add from 'date-fns/add'
import {randomUUID} from "crypto";


export const authService = {
    async createUser(login: string, password: string, email: string): Promise<TUser | null> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await usersService._generateHash(password, passwordSalt)
        const newUser: UserAccountDBType = {
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
                isConfirmed: false
            }
        }
        const createResult = await usersRepository.createUser(newUser)
        try {
            // убрал await, чтобы работал rateLimitMiddleware (10 секунд)
            emailManager.sendEmailConfirmationMessage(email, newUser.emailConfirmation.confirmationCode)
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

    async updateConfirmationCode(email: string): Promise<string | null> {
        const newConfirmationCode = randomUUID()
        await usersRepository.updateConfirmationCode(email, newConfirmationCode)
        try {
            // убрал await, чтобы работал rateLimitMiddleware (10 секунд)
            emailManager.sendEmailConfirmationMessage(email, newConfirmationCode)
        } catch (error) {
            return null
        }
        return newConfirmationCode
    }
}