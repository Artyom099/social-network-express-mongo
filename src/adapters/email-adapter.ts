import nodemailer from "nodemailer"


export const emailAdapter = {


    async sendEmail(email: string, subject: string, message: string) {
        let transporter  = await nodemailer.createTransport({
            host: 'smtp.mail.ru',
            port: 465,
            secure: true,
            auth: {
                user: 'artyom.dev@mail.ru',
                pass: '3VLABWWkQsUXVJW7vJ8j'
            }
        })
        return await transporter.sendMail({
            from: '"Fred Foo 👻" <artyom.dev@mail.ru>',    // sender address
            to: email,                                  // list of receivers
            subject: subject,                           // Subject line
            html: message,                              // html body
        })
    }
}