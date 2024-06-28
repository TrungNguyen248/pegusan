'use strict'
const { updateProgress } = require('../services/progress.service')
const { SuccessResponse } = require('../core/success.response')

const updateProgressCtr = async (req, res, next) => {
    new SuccessResponse({
        message: 'update success',
        metadata: await updateProgress({
            userId: req.user.userId,
            ...req.body,
        }),
    }).send(res)
}

module.exports = {
    updateProgressCtr,
}
