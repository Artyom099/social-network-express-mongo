import {UserViewModel, UserAccountDBModel} from "../../../types";
import {userCollection} from "../../../infrastructure/db/db";


export const userRepository = {
    async createUser(dto: UserAccountDBModel): Promise<UserViewModel> {
        await userCollection.insertOne(dto)
        return {
            id: dto.id,
            login: dto.accountData.login,
            email: dto.accountData.email,
            createdAt: dto.accountData.createdAt
        }
    },

    async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserAccountDBModel | null> {
        const user = await userCollection.findOne({ $or: [ {'accountData.email': loginOrEmail}, {'accountData.login': loginOrEmail} ]})
        if (!user) return null

        return user
    },

    async findUserById(id: string): Promise<UserViewModel | null> {
        const user = await userCollection.findOne({ id }, {projection: {_id: 0}})
        if (!user) return null

        return {
            id: user.id,
            login: user.accountData.login,
            email: user.accountData.email,
            createdAt: user.accountData.createdAt
        }
    },

    async deleteUserById(id: string) {
        return userCollection.deleteOne({ id })
    },

    async findUserByConfirmationCode(code: string): Promise<UserAccountDBModel | null> {
        const user = await userCollection.findOne({'emailConfirmation.confirmationCode': code})
        if (!user) return null

        return user
    },

    async updateEmailConfirmation(id: string) {
        await userCollection.updateOne({ id }, {$set: {'emailConfirmation.isConfirmed': true}})
    },

    async updateConfirmationCode(email: string, code: string) {
        await userCollection.updateOne(
          {'accountData.email': email},
          {$set: {'emailConfirmation.confirmationCode': code}}
        )
    },

    async setRecoveryCode(email: string, recoveryCode: string) {
        await userCollection.updateOne(
          {'accountData.email': email},
          {$set: {recoveryCode: recoveryCode}}
        )
    },

    async findUserByRecoveryCode(recoveryCode: string): Promise<boolean | null> {
        const user = await userCollection.findOne({ recoveryCode })
        return recoveryCode === user?.recoveryCode
    },

    async updateSaltAndHash(recoveryCode: string, salt: string, hash: string) {
        await userCollection.updateOne(
          { recoveryCode },
          { $set: { 'accountData.passwordSalt': salt, 'accountData.passwordHash': hash } }
        )
    }
}