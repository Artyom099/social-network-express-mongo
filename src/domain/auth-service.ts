import bcrypt from "bcrypt";
import {UserDBType} from "../types/types";
import {usersRepository} from "../repositories/users-repository";
import {usersService} from "./users-service";


export const authService = {
    async createUser(login: string, password: string, email: string) {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await usersService._generateHash(password, passwordSalt)
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

    async checkConfirmationCode(code: string): Promise<boolean> {
        return code === code;
    }
}