import {devicesCollection} from "../../infrastructure/db/db";
import {DeviceDBModel, DeviceViewModel} from "../../types";


export const deviceRepository = {
    async createSession(device: DeviceDBModel) {
        await devicesCollection.insertOne(device)
    },

    async updateLastActiveDate(deviceId: string, date: string) {
        await devicesCollection.updateOne({ deviceId }, { $set: { lastActiveDate: date } })
    },

    async getSessionsByUserId(userId: string): Promise<DeviceViewModel[]> {
        return devicesCollection.find({ userId }, { projection: { _id: 0, userId: 0 } }).toArray()
    },

    async getSessionByDeviceId(deviceId: string): Promise<DeviceViewModel | null> {
        const activeSession = await devicesCollection.findOne({ deviceId }, {projection: {_id: 0}})
        if (!activeSession) return null
        else return {
            ip: activeSession.ip,
            title: activeSession.title,
            lastActiveDate: activeSession.lastActiveDate,
            deviceId: activeSession.deviceId
        }
    },

    async deleteOtherSessions(deviceId: string) {
        await devicesCollection.deleteMany({ $nor: [{ deviceId }] })

    },

    async deleteSession(deviceId: string) {
        await devicesCollection.deleteOne({ deviceId })
    }
}