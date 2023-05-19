import jwt from 'jsonwebtoken'
import {settings} from '../settings'


export const jwtService = {
    async createJWT(userId: string, deviceId: string) {
        return {
            accessToken: jwt.sign({userId: userId, deviceId: deviceId}, settings.JWT_SECRET, {expiresIn: '10s'}),
            refreshToken: jwt.sign({userId: userId, deviceId: deviceId}, settings.JWT_SECRET, {expiresIn: '20s'})
        }
    },

    async getUserIdByToken(token: string): Promise<string | null> {
        try {
            // jwt.verify возвращает объект - { userId: '1682507411257', deviceId: '1682507411257', iat: 1682507422, exp: 1682511022 }
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return result.userId
        } catch (error) {
            return null
        }
    },

    async getPayloadByToken(token: string): Promise<any | null> {
        try {
            // jwt.decode возвращает объект - { userId: '1682507411257', deviceId: '1682507411257', iat: 1682507422, exp: 1682511022 }
            return jwt.decode(token)
        } catch (error) {
            return null
        }
    }
}