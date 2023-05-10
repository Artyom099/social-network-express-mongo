import {emailAdapter} from "../adapters/email-adapter";


export const emailManager = {
    async sendEmailConfirmationMessage(email: string, code: string) {
        const subject = 'Confirm your email'
        const message = ' <h1>Thank for your registration</h1>\n' +
            ' <p>To finish registration please follow the link below:\n' +
            `     <a href=\'https://somesite.com/confirm-email?code=${code}\'>complete registration</a>\n` +
            ' </p>\n'
        await emailAdapter.sendEmail(email, subject, message)
    }
}