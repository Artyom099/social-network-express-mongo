import {devicesCollection} from "../db/db";
import {DeviceDBType, DeviceViewModel} from "../types/types";


export const securityRepository = {
    async addActiveSession(device: DeviceDBType) {
        await devicesCollection.insertOne(device)
    },

    async updateLastActiveDateByDeviceId(deviceId: string, date: string) {
        await devicesCollection.updateOne({deviceId: deviceId}, {$set: {lastActiveDate: date}})
    },

    async finaAllActiveSessionsByUserId(userId: string): Promise<DeviceViewModel[]> {
        return await devicesCollection.find({userId: userId}, {projection: {_id: 0, userId: 0}}).toArray()
    },

    async findActiveSessionByDeviceId(deviceId: string): Promise<DeviceViewModel | null> {
        const activeSession = await devicesCollection.findOne({deviceId: deviceId}, {projection: {_id: 0}})
        if (!activeSession) return null
        else return {
            ip: activeSession.ip,
            title: activeSession.title,
            lastActiveDate: activeSession.lastActiveDate,
            deviceId: activeSession.deviceId
        }
    },

    async deleteOtherActiveSessionsByDeviceId(deviceId: string) {
        // todo - можно ли заменить $nor на $not ?
        await devicesCollection.deleteMany({$nor: [{deviceId: deviceId}] })

    },

    async deleteCurrentSessionByDeviceId(deviceId: string) {
        await devicesCollection.deleteOne({deviceId: deviceId})
    }
}