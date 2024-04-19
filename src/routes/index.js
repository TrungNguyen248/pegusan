'use strict'

const express = require('express')
const { apiKey, permission } = require('../auth/checkAuth')
const { pushToLogDiscord } = require('../middlewares')

const router = express.Router()

router.use(pushToLogDiscord)

router.use(apiKey)

router.use(permission('0000'))

router.use('/v1/api/course', require('./course'))
router.use('/v1/api/lesson', require('./lesson'))
router.use('/v1/api/vocab', require('./vocab'))
router.use('/v1/api/grammar', require('./grammar'))
router.use('/v1/api/comment', require('./comment'))
router.use('/v1/api/notification', require('./notification'))
router.use('/v1/api', require('./access'))

module.exports = router
