'use strict'

const express = require('express')
const { profiles, profile } = require('../../controllers/profile.controller')
const { authentication } = require('../../auth/authUtils')
const { grantAccess } = require('../../middlewares/rbac')

const router = express.Router()

router.use(authentication)

router.get('/viewAny', grantAccess('updateAny', 'profile'), profiles)
router.get('/viewOwn', grantAccess('readOwn', 'profile'), profile)
module.exports = router
