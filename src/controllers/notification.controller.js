'use strict'

const { listNotiByUser } = require('../services/notification.service')
const { SuccessResponse } = require('../core/success.response')

class NotificationController {
    listNotiByUser = async (req, res, next) => {
        new SuccessResponse({
            message: 'get list notifications',
            metadata: await listNotiByUser(req.query),
        }).send(res)
    }
}

module.exports = new NotificationController()
