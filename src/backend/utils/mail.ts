import nodemailer from 'nodemailer';
import { mailconfig } from '../config';
export async function sendmail(
    to: string,
    subject: string,
    text: string,
    html: string,
) {
    const transporter = nodemailer.createTransport(mailconfig);

    const info = await transporter.sendMail({
        from: '"CZEPEXPOL" <czapexpol@planlife.pl>', // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: html, // html body
    });

    //from: '"CZEPEXPOL" <czapexpol@planlife.pl>',
    //to: 'psmilgin@edu.cdv.pl',
    //subject: 'Hello ✔',
    //text: 'Hello world',
    //html: '<b>Hello world</b>',

    console.log('Message sent: %s', info.messageId);
}
