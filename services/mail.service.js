    const nodemailer = require('nodemailer')
    require('dotenv').config()

    const mailService = {
        async sendEmail({emailFrom, emailTo, emailSubject, emailText}){
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD
                }
            });
            await transporter.sendMail({
                from: emailFrom,
                to: emailTo,
                subject: emailSubject,
                text: emailText,
            });
        }
    };

    Object.freeze(mailService);

    module.exports = {
        mailService
    }