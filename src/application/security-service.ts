import {DeviceViewModel} from "../types/types";
import {securityRepository} from "../repositories/security-repository";


export const securityService = {
    async addActiveSession(ip: string, title: string, lastActiveDate: string, deviceId: string, userId: string) {
        const createdDevice = {ip, title, lastActiveDate, deviceId, userId}
        console.log(createdDevice)
        return await securityRepository.addActiveSession(createdDevice)
    },

    async updateLastActiveDateByDeviceId(deviceId: string, date: string) {
        return await securityRepository.updateLastActiveDateByDeviceId(deviceId, date)
    },

    async finaAllActiveSessionsByUserId(userId: string): Promise<DeviceViewModel[]> {
        return await securityRepository.finaAllActiveSessionsByUserId(userId)
    },

    async findActiveSessionByDeviceId(deviceId: string): Promise<DeviceViewModel | null> {
        return await securityRepository.findActiveSessionByDeviceId(deviceId)
    },

    async deleteOtherActiveSessionsByUserId(userId: string) {
        return await securityRepository.deleteOtherActiveSessionsByUserId(userId)
    },

    async deleteCurrentSessionByDeviceId(deviceId: string) {
        return await securityRepository.deleteCurrentSessionByDeviceId(deviceId)
    }
}