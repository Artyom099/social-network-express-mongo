import {UserViewModel, UserAccountDBModel} from "../types/types";
import {userCollection} from "../db/db";


export const usersRepository = {
    async createUser(newUser: UserAccountDBModel): Promise<UserViewModel> {
        await userCollection.insertOne(newUser)
        return {
            id: newUser.id,
            login: newUser.accountData.login,
            email: newUser.accountData.email,
            createdAt: newUser.accountData.createdAt
        }
    },

    async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserAccountDBModel | null> {
        const user = await userCollection.findOne({ $or: [ {'accountData.email': loginOrEmail}, {'accountData.login': loginOrEmail} ]})
        if (user) return user
        else return null
    },

    async findUserById(id: string): Promise<UserViewModel | null> {
        const user = await userCollection.findOne({ id }, {projection: {_id: 0}})
        if (user) return {
            id: user.id,
            login: user.accountData.login,
            email: user.accountData.email,
            createdAt: user.accountData.createdAt
        }
        else return null
    },

    async deleteUserById(id: string) {
        return userCollection.deleteOne({ id })
    },

    async findUserByConfirmationCode(code: string): Promise<UserAccountDBModel | null> {
        const user = await userCollection.findOne({'emailConfirmation.confirmationCode': code})
        if (user) return user
        else return null
    },

    async updateEmailConfirmation(id: string) {
        await userCollection.updateOne({ id }, {$set: {'emailConfirmation.isConfirmed': true}})
    },

    async updateConfirmationCode(email: string, code: string) {
        await userCollection.updateOne({'accountData.email': email}, {$set: {'emailConfirmation.confirmationCode': code}})
    },

    async setRecoveryCode(email: string, recoveryCode: string) {
        await userCollection.updateOne({'accountData.email': email}, {$set: {recoveryCode: recoveryCode}})
    },

    async findUserByRecoveryCode(recoveryCode: string): Promise<boolean | null> {
        const user = await userCollection.findOne({ recoveryCode })
        return (recoveryCode === user?.recoveryCode)
    },

    async updateSaltAndHash(recoveryCode: string, salt: string, hash: string) {
        await userCollection.updateOne({ recoveryCode }, {$set: {'accountData.passwordSalt': salt, 'accountData.passwordHash': hash}})
    }
}