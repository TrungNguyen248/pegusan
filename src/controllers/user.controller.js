'use strict'

const { SuccessResponse } = require('../core/success.response')
const {
    allUsers,
    profileService,
    checkLoginEmailTokenService,
    verifyEmailService,
} = require('../services/user.service')

class UserController {
    getAllUser = async (req, res, next) => {
        new SuccessResponse({
            message: 'get list user success',
            metadata: await allUsers(),
        }).send(res)
    }
    verifyEmailCtr = async (req, res, next) => {
        new SuccessResponse({
            message: 'Verified email successfully',
            metadata: await verifyEmailService({
                email: req.user.email,
            }),
        }).send(res)
    }
    //check user token via email
    checkLoginEmailToken = async (req, res, next) => {
        const { token = null } = req.query

        new SuccessResponse({
            message: 'User login successfully',
            metadata: await checkLoginEmailTokenService({
                token,
            }),
        }).send(res)
    }
    //user profile
    profileCtr = async (req, res, next) => {
        new SuccessResponse({
            message: 'User profile successfully',
            metadata: await profileService({
                userId: req.user.userId,
            }),
        }).send(res)
    }
}

module.exports = new UserController()
