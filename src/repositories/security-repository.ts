import {devicesCollection} from "../db/db";
import {DeviceViewModel} from "../types/types";


export const securityRepository = {
    async finaAllLoginDevicesByUserId(userId: string): Promise<DeviceViewModel[]> {
        return await devicesCollection.find({userId: userId}, {projection: {_id: 0, userId: 0}}).toArray()
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