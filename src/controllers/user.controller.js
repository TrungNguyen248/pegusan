'use strict'

const { SuccessResponse } = require('../core/success.response')
const {
    newUserService,
    checkLoginEmailTokenService,
    verifyEmailService,
} = require('../services/user.service')

class UserController {
    verifyEmailCtr = async (req, res, next) => {
        new SuccessResponse({
            message: 'Verified email successfully',
            metadata: await verifyEmailService({
                email: req.user.email,
            }),
        }).send(res)
    }
    //new user
    newUser = async (req, res, next) => {
        const response = await newUserService({
            email: req.body.email,
        })
        new SuccessResponse({
            message: 'new user successfully',
            metadata: response,
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
}

module.exports = new UserController()
