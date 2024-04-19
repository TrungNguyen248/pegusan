'use strict'

const LoggerService = require('../loggers/discord.log')

const pushToLogDiscord = async (req, res, next) => {
    try {
        LoggerService.sendToFormatCode({
            title: `Method: ${req.method}`,
            code: req.method === 'GET' ? req.query : req.body,
            message: `${req.get('host')}${req.originalUrl}`,
        })
        return next()
    } catch (e) {
        next(e)
    }
}

module.exports = {
    pushToLogDiscord,
}
