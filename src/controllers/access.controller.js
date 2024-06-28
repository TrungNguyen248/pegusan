'use strict'

const AccessService = require('../services/access.service')

const { CREATED, SuccessResponse } = require('../core/success.response')
const { BadRequestError } = require('../core/error.response')

class AccessController {
    handlerRefreshToken = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get tokens success',
            metadata: await AccessService.handlerRefreshToken({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore,
            }),
        }).send(res)
    }
    logout = async (req, res, next) => {
        new SuccessResponse({
            message: 'Logout success',
            metadata: await AccessService.logout(req.keyStore),
        }).send(res)
    }
    login = async (req, res, next) => {
        const { email } = req.body
        if (!email) throw new BadRequestError('Email missing')

        const sendData = Object.assign(
            {
                requestId: req.requestId,
            },
            req.body
        )
        new SuccessResponse({
            metadata: await AccessService.login(sendData),
        }).send(res)
    }
    signUp = async (req, res, next) => {
        new CREATED({
            message: 'Registered Ok!!',
            metadata: await AccessService.signUp(req.body),
        }).send(res)
    }
}

module.exports = new AccessController()
