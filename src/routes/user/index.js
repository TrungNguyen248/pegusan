'use strict'

const express = require('express')
const asyncHandler = require('../../middlewares/asyncHandler')
const userController = require('../../controllers/user.controller')
const { authentication } = require('../../auth/authUtils')
const { grantAccess } = require('../../middlewares/rbac')

const router = express.Router()
//update grant for get all user
router.get('/all', asyncHandler(userController.getAllUser))
router.get('/welcome-back', asyncHandler(userController.checkLoginEmailToken))
router.use(authentication)
//router.post('/new_user', asyncHandler(userController.newUser))
router.post('/verify-email', asyncHandler(userController.verifyEmailCtr))
router.get(
    '/profile',
    grantAccess('readOwn', 'profile'),
    asyncHandler(userController.profileCtr)
)

module.exports = router
