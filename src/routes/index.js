'use strict'

const express = require('express')
const { apiKey, permission } = require('../auth/checkAuth')

const router = express.Router()

router.use(apiKey)

router.use(permission('0000'))

router.use('/v1/api', require('./access'))
router.use('/v1/api/course', require('./course'))
router.use('/v1/api/lesson', require('./lesson'))
router.use('/v1/api/vocab', require('./vocab'))

module.exports = router
