'use strict'

const { randomInt } = require('crypto')
const otpModel = require('../models/otp.model')
const { NotFoundError } = require('../core/error.response')

const generatoTokenRandom = () => {
    const token = randomInt(0, Math.pow(2, 32))
    return token
}

const newOtp = async ({ email }) => {
    const token = generatoTokenRandom()
    const newToken = await otpModel.create({
        otp_token: token,
        otp_email: email,
    })

    return newToken
}

const checkEmailToken = async ({ token }) => {
    //check token in db
    const tokenExist = await otpModel.findOne({ otp_token: token })
    if (!tokenExist) throw new NotFoundError('Token not found')

    //delete token
    await otpModel.deleteOne({ otp_token: token })

    return tokenExist
}

module.exports = {
    newOtp,
    checkEmailToken,
}
