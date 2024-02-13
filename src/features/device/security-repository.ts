import {devicesCollection} from "../../infrastructure/db/db";
import {DeviceDBModel, DeviceViewModel} from "../../infrastructure/types/types";


export const securityRepository = {
    async addActiveSession(device: DeviceDBModel) {
        await devicesCollection.insertOne(device)
    },

    async updateLastActiveDateByDeviceId(deviceId: string, date: string) {
        await devicesCollection.updateOne({ deviceId }, {$set: {lastActiveDate: date}})
    },

    async finaAllActiveSessionsByUserId(userId: string): Promise<DeviceViewModel[]> {
        return await devicesCollection.find({ userId }, {projection: {_id: 0, userId: 0}}).toArray()
    },

    async findActiveSessionByDeviceId(deviceId: string): Promise<DeviceViewModel | null> {
        const activeSession = await devicesCollection.findOne({ deviceId }, {projection: {_id: 0}})
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
        await devicesCollection.deleteMany({$nor: [{ deviceId }] })

    },

    async deleteCurrentSessionByDeviceId(deviceId: string) {
        await devicesCollection.deleteOne({ deviceId })
    }
}