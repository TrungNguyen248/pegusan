'use strict'
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const KeyTokenService = require('./keyToken.service')
const { createTokenPair } = require('../auth/authUtils')
const { getInfoData } = require('../utils')

const {
    ErrorResponse,
    BadRequestError,
    NotFoundError,
} = require('../core/error.response')
const userModel = require('../models/user.model')
const { sendEmailToken } = require('./email.service')
const { checkEmailToken } = require('./otp.service')
const { createUser } = require('../models/repos/user.repo')

const verifyEmailService = async ({ email }) => {
    console.log('verifyEmailService', email)
    const user = await userModel.findOne({ email }).lean()

    if (!user) {
        throw new BadRequestError('user not registered!')
    }

    const result = await sendEmailToken({
        email,
    })

    return result
}

const newUserService = async ({ email = null, captcha = null }) => {
    //1. check email exists in dbs
    const user = await userModel.findOne({ email }).lean()

    //2. if exists
    if (user) {
        throw new BadRequestError('user already exists')
    }

    //3. Send token via email user
    const result = await sendEmailToken({
        email,
    })

    return result
}

// const checkLoginEmailTokenService = async ({ token }) => {
//     //1. check token in db
//     const { otp_email: email, otp_token } = await checkEmailToken({
//         token,
//     })

//     if (!email) throw new NotFoundError('Token not found')

//     //2. check email exists
//     const userExists = await findUserByEmailWithLogin({ email })
//     if (userExists) throw new NotFoundError('Email already exists')

//     const passwordHash = await bcrypt.hash(email, 10)

//     const newUser = await createUser({
//         user_id: 1,
//         name: email,
//         email: email,
//         user_slug: 'testsuto',
//         password: passwordHash,
//         roles: '66254502666730f622699f4a',
//     })

//     if (newUser) {
//         const publicKey = crypto.randomBytes(64).toString('hex')
//         const privateKey = crypto.randomBytes(64).toString('hex')

//         //save collection key
//         const keyStore = await KeyTokenService.createKeyToken({
//             userId: newUser.user_id,
//             publicKey,
//             privateKey,
//         })

//         if (!keyStore) {
//             throw new BadRequestError('Key store error')
//         }

//         //created token pair
//         const tokens = await createTokenPair(
//             { userId: newUser._id, email },
//             publicKey,
//             privateKey
//         )

//         //console.log(`Created Token Success`, tokens)

//         return {
//             user: getInfoData({
//                 fields: ['usr_id', 'name', 'email'],
//                 object: newUser,
//             }),
//             tokens,
//         }
//     }
// }

const checkLoginEmailTokenService = async ({ token }) => {
    const { otp_email: email, otp_token } = await checkEmailToken({
        token,
    })

    if (!email) throw new NotFoundError('Token not found')
    const userExists = await findUserByEmailWithLogin({ email })
    if (!userExists) throw new NotFoundError('Email not registered')

    userExists.status = 'active'

    await userExists.save()

    return 'Verified'
}

const findUserByEmailWithLogin = async ({ email }) => {
    const user = await userModel.findOne({ email })

    return user
}

module.exports = {
    newUserService,
    checkLoginEmailTokenService,
    verifyEmailService,
}
