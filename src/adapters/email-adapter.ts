import nodemailer from "nodemailer"


export const emailAdapter = {


    async sendEmail(email: string, subject: string, message: string) {
        let transporter  = await nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: 'avis.fisher93@ethereal.email',
                pass: 'w5rPJ3dPdFBUw48T7V'
            }
        })
        return await transporter.sendMail({
            from: '"Fred Foo 👻" <avis.fisher93@ethereal.email>',    // sender address
            to: email,                                  // list of receivers
            subject: subject,                           // Subject line
            html: message,                              // html body
        })
    }
}