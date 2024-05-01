import {DeviceViewModel} from "../../types";
import {securityRepository} from "./security-repository";


export const securityService = {
    async addActiveSession(ip: string, title: string, lastActiveDate: string, deviceId: string, userId: string) {
        const createdDevice = {ip, title, lastActiveDate, deviceId, userId}
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

    async deleteOtherActiveSessionsByDeviceId(deviceId: string) {
        return await securityRepository.deleteOtherActiveSessionsByDeviceId(deviceId)
    },

    async deleteCurrentSessionByDeviceId(deviceId: string) {
        return await securityRepository.deleteCurrentSessionByDeviceId(deviceId)
    }
}