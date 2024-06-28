'use strict'

const { SuccessResponse } = require('../core/success.response')
const { scheduleSerivce } = require('../services/schedule.service')

const scheduleController = async (req, res, next) => {
    new SuccessResponse({
        message: 'updated',
        metadata: await scheduleSerivce(req.body),
    }).send(res)
}

module.exports = {
    scheduleController,
}
