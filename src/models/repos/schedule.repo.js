'use strict'

const scheduleModel = require('../schedule.model')

const findByUserId = async ({ userId }) => {
    return scheduleModel.findOne({ user: userId }).lean()
}

module.exports = {
    findByUserId,
}
