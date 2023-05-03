import bcrypt from "bcrypt";
import {UserAccountDBType, UserDBType} from "../types/types";
import {usersRepository} from "../repositories/users-repository";
import {usersService} from "./users-service";
import {emailManager} from "../managers/email-manager";
import {v4 as uuidv4} from 'uuid'
import add from 'date-fns/add'


export const authService = {
    async createUser(login: string, password: string, email: string) {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await usersService._generateHash(password, passwordSalt)
        const dateNow = new Date()
        const newUser: UserAccountDBType = {
            id: (+dateNow).toString(),
            accountData: {
                login,
                email,
                passwordHash,
                passwordSalt,
                createdAt: dateNow.toISOString()
            },
            emailConfirmation: {
                // todo начать с заполнения этого объекта по видео
                confirmationCode: uuidv4(),
                expirationDate: add(new Date, {minutes: 10}),
                isConfirmed: false
            }
        }
        const createResult = await usersRepository.createUser(newUser)
        await emailManager.sendEmailConfirmationMessage(email)
        return createResult
    },

    async checkConfirmationCode(code: string): Promise<boolean> {
        //todo вернуть объект с ошибкой
        return code === code;
    }
}