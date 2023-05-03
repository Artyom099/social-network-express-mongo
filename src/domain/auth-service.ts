import bcrypt from "bcrypt";
import {TUser, UserAccountDBType} from "../types/types";
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
            await emailManager.sendEmailConfirmationMessage(email)
        } catch (error) {
            await usersService.deleteUser(newUser.id)
            return null
        }
        return createResult
    },

    async checkConfirmationCode(code: string, email: string): Promise<boolean> {
        // проверка кода на правильность, срок жизни и повторное использование
        const user = await usersRepository.findUserByLoginOrEmail(email)
        if (user && user.emailConfirmation.confirmationCode === code && !user.emailConfirmation.isConfirmed &&
            user.emailConfirmation.expirationDate > new Date()) {
            await usersRepository.updateConfirmation(user.id)
            return true
        } else {
            return false
        }
    }
}