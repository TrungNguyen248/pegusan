'use strict'
const {
    BadRequestError,
    NotFoundError,
    AuthFailureError,
} = require('../core/error.response')
const userModel = require('../models/user.model')
const progressModel = require('../models/progress.model')
const pointModel = require('../models/point.model')
const { sendEmailToken } = require('./email.service')
const { checkEmailToken } = require('./otp.service')
const { convert2ObjectId } = require('../utils')
const { parseBypoint } = require('../utils/level_up.util')

const verifyEmailService = async ({ email }) => {
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

const profileService = async ({ userId }) => {
    const userExist = await userModel.findById(convert2ObjectId(userId))
    if (!userExist)
        throw new AuthFailureError('AuthFailureError:User not found')
    const progress = await progressModel
        .findOne({
            user: convert2ObjectId(userId),
        })
        .populate({
            path: 'progress',
            populate: { path: 'course', select: 'name stu_num thumb ' },
        })
        .select('progress achievements ')
        .lean()
    const user_point = await pointModel
        .findOne({
            user: userId,
        })
        .lean()
    const levelDetail = parseBypoint(user_point.total_point)

    return {
        user: userExist,
        progress: progress,
        level_detail: levelDetail,
    }
}

module.exports = {
    newUserService,
    checkLoginEmailTokenService,
    verifyEmailService,
    profileService,
}
