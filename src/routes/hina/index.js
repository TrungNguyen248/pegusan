'use strict'

const express = require('express')
const asyncHandler = require('../../middlewares/asyncHandler')
const { authentication } = require('../../auth/authUtils')
const {
    addHina,
    getHina,
    getHinaLesson,
} = require('../../controllers/hina.controller')
const { grantAccess } = require('../../middlewares/rbac')

const router = express.Router()
router.use(authentication)

router.post('/', grantAccess('createAny', 'hina'), asyncHandler(addHina))
router.get('/:title', grantAccess('readAny', 'hina'), asyncHandler(getHina))
router.post('/run', grantAccess('readAny', 'hina'), asyncHandler(getHinaLesson))

module.exports = router
