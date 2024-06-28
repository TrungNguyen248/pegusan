'use strict'

const transport = require('../configs/config.email')
const { newOtp } = require('./otp.service')
const { getTemplate } = require('./template.service')
const { NotFoundError } = require('../core/error.response')
const { replacePlaceholder } = require('../utils')

const sendEmailLinkVerify = async ({
    html,
    toEmail,
    subject = 'Confirm email please!!',
    text = 'Xacs nhan',
}) => {
    try {
        const mailOptions = {
            from: 'Nguyen <hinkiller1@gmail.com>',
            to: toEmail,
            subject,
            text,
            html,
        }

        transport.sendMail(mailOptions, (err, info) => {
            if (err) {
                return console.log(err)
            }
            console.log('Message sent: ', info.messageId)
        })
    } catch (error) {
        console.log('Email sent worng', error)

        return error
    }
}

const sendEmailToken = async ({ email = null }) => {
    try {
        //1. get token
        const token = await newOtp({ email })

        //2. get email template
        const template = await getTemplate({
            tem_name: 'HTML EMAIL TOKEN',
        })

        if (!template) {
            throw new NotFoundError('Template not found')
        }

        //3. replace to holder (link to FE that verified)
        const content = replacePlaceholder(template.tem_html, {
            link_verify: `http://localhost:5000/v1/api/user/welcome-back?token=${token.otp_token}`,
        })

        //4.Send email
        sendEmailLinkVerify({
            html: content,
            toEmail: email,
            subject: 'Confirmation email!!!!',
        }).catch((err) => console.log(err))

        return 1
    } catch (error) {}
}

module.exports = {
    sendEmailToken,
}
