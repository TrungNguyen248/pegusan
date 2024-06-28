'use strict'

const express = require('express')
const courseController = require('../../controllers/course.controller')
const asyncHandler = require('../../middlewares/asyncHandler')
const vocabularyController = require('../../controllers/vocabulary.controller')
const { grantAccess } = require('../../middlewares/rbac')
const { authentication } = require('../../auth/authUtils')

const router = express.Router()
router.use(authentication)

router.post(
    '/all',
    grantAccess('readAny', 'course'),
    asyncHandler(courseController.getAllCourse)
)
router.post(
    '',
    grantAccess('createAny', 'course'),
    asyncHandler(courseController.createCourse)
)
router.patch(
    '/:course_id',
    grantAccess('updateAny', 'course'),
    asyncHandler(courseController.updateCourse)
)

module.exports = router
