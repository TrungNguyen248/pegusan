'use strict'
const express = require('express')
const { authentication } = require('../../auth/authUtils')
const asyncHandler = require('../../middlewares/asyncHandler')
const { updateProgressCtr } = require('../../controllers/progress.controller')
const { grantAccess } = require('../../middlewares/rbac')

const router = express.Router()
router.use(authentication)

router.post(
    '/',
    grantAccess('updateOwn', 'progress'),
    asyncHandler(updateProgressCtr)
)

module.exports = router
