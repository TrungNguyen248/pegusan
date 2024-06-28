'use strict'
const nodemailer = require('nodemailer')
const pug = require('pug')
const htmlToText = require('html-to-text')
const {
    email: { host, port, auth, email_from },
    app: { env },
} = require('./config')

const transport = nodemailer.createTransport({
    host: host,
    port: port,
    secure: true,
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
    },
    auth: auth,
})

module.exports = transport

// module.exports = class Email {
//     constructor(user, url) {
//         this.to = user.email
//         this.firstName = user.name.split(' ')[0]
//         this.url = url
//         this.from = `xxx <${email_from}>`
//     }

//     newTransport() {
//         if (env === 'pro') {
//             return 1
//         }

//         return nodemailer.createTransport({
//             host: host,
//             port: port,
//             auth: auth,
//         })
//     }

//     async send(template, subject) {
//         // 1. Render html
//         const html = pug.renderFile(`${__dirname}/../utils/${template}.pug`, {
//             firstName: this.firstName,
//             url: this.url,
//             subject,
//         })

//         // 2. Define the email options
//         const mailOptions = {
//             form: 'abc',
//             to: this.to,
//             subject: subject,
//             text: htmlToText.fromString(html),
//             html: html,
//         }

//         // 3. Create a transport and send email
//         await this.newTransport().sendMail(mailOptions)
//     }
// }
