import {emailAdapter} from "../adapters/email-adapter";


export const emailManager = {
    async sendEmailConfirmationMessage(email: string) {
        const subject = 'Confirm your email'
        const confirmationCode = +(new Date()).toString()
        const message = ' <h1>Thank for your registration</h1>\n' +
            ' <p>To finish registration please follow the link below:\n' +
            `     <a href=\'https://somesite.com/confirm-email?code=${confirmationCode}\'>complete registration</a>\n` +
            ' </p>\n'
        await emailAdapter.sendEmail(email, subject, message)
    },

    // async sendPasswordRecoveryMessage() {
    //     const subject = 'password recovery'
    //     const message = '<div>Click here</div>'
    //     // save to repo
    //     // get user from repo
    //     await emailAdapter.sendEmail(user.email, subject, message)
    // }
}