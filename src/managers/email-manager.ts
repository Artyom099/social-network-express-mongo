import {emailAdapter} from "../adapters/email-adapter";


export const emailManager = {
    async sendPasswordRecoveryMessage(user) {
        const subject = 'password recovery'
        const message = '<div>TAB here</div>'
        // save to repo
        // get user from repo
        await emailAdapter.sendEmail(user.email, subject, message)
    }
}