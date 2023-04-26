import {UserDBType} from "../types"
import {ObjectId} from "mongodb"
import jwt from 'jsonwebtoken'
import {settings} from '../settings'


export const jwtService = {
    async createJWT(user: UserDBType) {
        return jwt.sign({userId: user.id}, settings.JWT_SECRET, {expiresIn: '1h'})
    },

    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)  // todo что возвращает jwt.verify
            return new ObjectId(result.userId)
        } catch (error) {
            return null
        }
    }
}