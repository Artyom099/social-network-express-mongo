import {DeviceViewModel} from "../../types";
import {deviceRepository} from "./device-repository";


export const deviceService = {
    async addActiveSession(ip: string, title: string, lastActiveDate: string, deviceId: string, userId: string) {
        const createdDevice = {ip, title, lastActiveDate, deviceId, userId}
        return await deviceRepository.createSession(createdDevice)
    },

    async updateLastActiveDateByDeviceId(deviceId: string, date: string) {
        return await deviceRepository.updateLastActiveDate(deviceId, date)
    },

    async finaAllActiveSessionsByUserId(userId: string): Promise<DeviceViewModel[]> {
        return await deviceRepository.getSessionsByUserId(userId)
    },

    async findActiveSessionByDeviceId(deviceId: string): Promise<DeviceViewModel | null> {
        return await deviceRepository.getSessionByDeviceId(deviceId)
    },

    async deleteOtherActiveSessionsByDeviceId(deviceId: string) {
        return await deviceRepository.deleteOtherSessions(deviceId)
    },

    async deleteCurrentSessionByDeviceId(deviceId: string) {
        return await deviceRepository.deleteSession(deviceId)
    }
}