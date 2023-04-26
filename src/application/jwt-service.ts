import {UserDBType} from "../types"
import jwt from 'jsonwebtoken'
import {settings} from '../settings'


export const jwtService = {
    async createJWT(user: UserDBType) {
        return jwt.sign({userId: user.id}, settings.JWT_SECRET, {expiresIn: '1h'})
    },

    async getUserIdByToken(token: string) {
        try {
            // jwt.verify возвращает объект - { userId: '1682507411257', iat: 1682507422, exp: 1682511022 }
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return result.userId
        } catch (error) {
            return null
        }
    }
}