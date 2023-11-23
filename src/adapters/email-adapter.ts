import nodemailer from "nodemailer";
import {NewAuthUserType, UserViewType} from "../types/types";
import {WithId} from "mongodb";


export const emailAdapter = {
    async sendConfirmationEmail(newUser: WithId<NewAuthUserType>) {
        const { accountData, emailConfirmation } = newUser

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'nodekrup@gmail.com',
                pass: 'bofti0-nedneQ-cohfas' //bofti0-nedneQ-cohfas
            }
        })

        const emailOptions = {
            from: 'Natallia Node 👻 <nodekrup@gmail.com>', // sender address
            to: accountData.email, // list of receivers
            subject: "Registration", // Subject line
            html: `<h1>Thanks for your registration</h1> 
                    <p>To finish registration please follow the link below: 
                    <a href='https://somesite.com/confirm-email?code=${emailConfirmation.confirmationCode}'>complete registration</a> 
                    </p>`, // html body
        }

        transporter.sendMail(emailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        })

    }
}