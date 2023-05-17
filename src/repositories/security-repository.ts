import {devicesCollection} from "../db/db";
import {DeviceDBType} from "../types/types";


export const securityRepository = {
    async finaAllLoginDevicesByUserId(userId: string): Promise<DeviceDBType[]> {
        return await devicesCollection.find({userId: userId})
    }
}