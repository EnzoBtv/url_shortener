import { createTransport } from "nodemailer";

import Logger from "./logger";
export default class Email {
    static TRANSPORTER = createTransport({
        host: "smtp-mail.outlook.com",
        port: 587,
        secure: true,
        tls: {
            ciphers: "SSLv3"
        },
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    to: string;
    from: string = process.env.EMAIL_USER;
    subject: string;
    text: string;
    html: string | null;

    constructor(
        to: string,
        subject: string,
        text: string,
        html: string | null
    ) {
        this.to = to;
        this.subject = subject;
        this.text = text;
        this.html = html;
    }
    async send() {
        try {
            let mail = await Email.TRANSPORTER.sendMail({
                from: this.from,
                to: this.to,
                subject: this.subject,
                text: this.text,
                html: this.html ? this.html : null
            });
            if (mail) {
                Logger.info(
                    "Email de recuperação de senha enviado" +
                        JSON.stringify(mail)
                );
                return mail;
            }
        } catch (ex) {
            return ex;
        }
    }
}
