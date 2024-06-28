'use strict'

const express = require('express')
const {
    newRole,
    newResource,
    roleLists,
    resourceLists,
} = require('../../controllers/rbac.controller')
const asyncHandler = require('../../middlewares/asyncHandler')
const { grantAccess } = require('../../middlewares/rbac')
const { authentication } = require('../../auth/authUtils')

const router = express.Router()
router.use(authentication)

router.post('/role', grantAccess('createAny', 'rbac'), asyncHandler(newRole))
router.get('/roles', grantAccess('readAny', 'rbac'), asyncHandler(roleLists))
router.post(
    '/resource',
    grantAccess('createAny', 'rbac'),
    asyncHandler(newResource)
)
router.get(
    '/resources',
    grantAccess('readAny', 'rbac'),
    asyncHandler(resourceLists)
)
module.exports = router
