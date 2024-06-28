'use strict'

const express = require('express')
const asyncHandler = require('../../middlewares/asyncHandler')
const { authentication } = require('../../auth/authUtils')
const { grantAccess } = require('../../middlewares/rbac')

const {
    submitPointCtr,
    getRankListCtr,
    getRankByUserIdCtr,
} = require('../../controllers/leader.controller')

const router = express.Router()
router.use(authentication)

//router.get('/test_cron', asyncHandler(test))
router.post(
    '',
    grantAccess('updateOwn', 'leader'),
    asyncHandler(submitPointCtr)
)
router.get('', grantAccess('readAny', 'leader'), asyncHandler(getRankListCtr))
router.get(
    '/:user_id',
    grantAccess('readOwn', 'leader'),
    asyncHandler(getRankByUserIdCtr)
)
module.exports = router
