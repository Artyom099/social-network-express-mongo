import {devicesCollection} from "../db/db";
import {DeviceViewModel} from "../types/types";


export const securityRepository = {
    async finaAllLoginDevicesByUserId(userId: string): Promise<DeviceViewModel[]> {
        const loginDevices = await devicesCollection.find({userId: userId})
        // const foundActiveDevices = await devicesCollection.find({userId: userId})
        // if (foundActiveDevices) return foundActiveDevices
        // else return null
        return {
            ip: loginDevices.ip,
            title: loginDevices.title,
            lastActiveDate: loginDevices.lastActiveDate,
            deviceId: loginDevices.deviceId,
        }
    },

    async findActiveSessionByDeviceId(deviceId: string): Promise<DeviceViewModel | null> {
        const activeSession = await devicesCollection.findOne({deviceId: deviceId})
        if (!activeSession) return null
        else return {
            ip: activeSession.ip,
            title: activeSession.title,
            lastActiveDate: activeSession.lastActiveDate,
            deviceId: activeSession.deviceId,
        }
    },

    async deleteActiveSessionByDeviceId(deviceId: string) {
        await devicesCollection.deleteOne({deviceId: deviceId})
    }
}