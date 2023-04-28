import nodemailer from "nodemailer"

export const emailAdapter = {
    async sendEmail(email: string, subject: string, message: string) {
        const testAccount = {
            user: 'artgolubev@bk.ru',
            pass: 'qwerty1'
        }
        let transporter  = await nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: testAccount.user, // email, с которого мы отправляем
                pass: testAccount.pass, // его пароль
            }
        })
        return await transporter.sendMail({
            from: '"Fred Foo 👻" <testAccount.user>', // sender address
            to: email,                     // list of receivers
            subject: subject,              // Subject line
            html: message,                 // html body
        })
    }

}