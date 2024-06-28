'use strict'

const express = require('express')
const asyncHandler = require('../../middlewares/asyncHandler')
const emailController = require('../../controllers/email.controller')
//const { authentication } = require('../../auth/authUtils')
const { grantAccess } = require('../../middlewares/rbac')

const router = express.Router()
//router.use(authentication)
router.post(
    '/new_template',
    grantAccess('createAny', 'email'),
    asyncHandler(emailController.newTemplate)
)

module.exports = router
