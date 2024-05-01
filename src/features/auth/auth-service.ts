import bcrypt from "bcrypt";
import {UserViewModel, UserAccountDBModel} from "../../types";
import {usersRepository} from "../user/infrastructure/users-repository";
import {usersService} from "../user/application/users-service";
import {emailManager} from "../../infrastructure/email/email-manager";
import add from 'date-fns/add'
import {randomUUID} from "crypto";


export const authService = {
    async createUser(login: string, password: string, email: string): Promise<UserViewModel | null> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await usersService._generateHash(password, passwordSalt)
        const newUser: UserAccountDBModel = {
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
            },
            recoveryCode: null
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
    },

    async sendRecoveryCode(email: string) {
        const recoveryCode = randomUUID()
        await usersRepository.setRecoveryCode(email, recoveryCode)
        try {
            await emailManager.sendEmailRecoveryCode(email, recoveryCode)
        } catch (error) {
            return null
        }
        return recoveryCode
    },

    async checkRecoveryCode(code: string): Promise<boolean | null> {
        return usersRepository.findUserByRecoveryCode(code)
    },

    async updatePassword(code: string, password: string) {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await usersService._generateHash(password, passwordSalt)
        await usersRepository.updateSaltAndHash(code, passwordSalt, passwordHash)
    }
}