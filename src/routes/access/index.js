'use strict'

const express = require('express')
const accessController = require('../../controllers/access.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtils')
const router = express.Router()

//sign up
router.post('/user/signup', asyncHandler(accessController.signUp))
//sign in
router.post('/user/login', asyncHandler(accessController.login))

//authentication
router.use(authentication)
//////////
router.post('/user/logout', asyncHandler(accessController.logout))
router.post(
    '/user/handlerRefreshToken',
    asyncHandler(accessController.handlerRefreshToken)
)

module.exports = router
