import {DeviceViewModel} from "../types/types";
import {securityRepository} from "../repositories/security-repository";


export const securityService = {
    async finaAllLoginDevicesByUserId(userId: string): Promise<DeviceViewModel[]> {
        return await securityRepository.finaAllLoginDevicesByUserId(userId)
    }
}