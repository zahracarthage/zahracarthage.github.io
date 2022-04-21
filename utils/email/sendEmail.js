const nodemailer = require("nodemailer");
//import {EmailTemplate} from './emailTemplate';
const { promisify } = require('util');
const fs = require('fs');
const readFile = promisify(fs.readFile);
const ejs = require("ejs");


const sendEmail = async (email, subject, text) => {
    
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: subject,
          //  text:text,
            html: await ejs.renderFile('utils/email/emailTemplate.ejs',{link: text}),

        });
        console.log(text);
        //console.log(link);


        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = sendEmail;