'use strict'

const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const NotificationController = require('../../controllers/notification.controller')
const { authentication } = require('../../auth/authUtils')

const router = express.Router()
//noti before login

router.use(authentication)
//noti after login
router.get('', asyncHandler(NotificationController.listNotiByUser))

module.exports = router
