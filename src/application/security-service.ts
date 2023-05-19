import {DeviceViewModel} from "../types/types";
import {securityRepository} from "../repositories/security-repository";


export const securityService = {
    async finaAllActiveSessionsByUserId(userId: string): Promise<DeviceViewModel[]> {
        return await securityRepository.finaAllActiveSessionsByUserId(userId)
    },

    async findActiveSessionByDeviceId(deviceId: string): Promise<DeviceViewModel | null> {
        return await securityRepository.findActiveSessionByDeviceId(deviceId)
    },

    async deleteOtherActiveSessionsByUserId(userId: string) {
        return await securityRepository.deleteOtherActiveSessionsByUserId(userId)
    },

    async deleteActiveSessionByDeviceId(deviceId: string) {
        return await securityRepository.deleteActiveSessionByDeviceId(deviceId)
    }
}