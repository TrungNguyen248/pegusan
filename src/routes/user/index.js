'use strict'

const express = require('express')
const asyncHandler = require('../../middlewares/asyncHandler')
const userController = require('../../controllers/user.controller')
const { authentication } = require('../../auth/authUtils')

const router = express.Router()
router.get('/welcome-back', asyncHandler(userController.checkLoginEmailToken))
router.use(authentication)
//router.post('/new_user', asyncHandler(userController.newUser))
router.post('/verify-email', asyncHandler(userController.verifyEmailCtr))

module.exports = router
