'use strict'

const express = require('express')
const asyncHandler = require('../../middlewares/asyncHandler')
const lessonController = require('../../controllers/lesson.controller')
const { authentication } = require('../../auth/authUtils')
const { grantAccess } = require('../../middlewares/rbac')

const router = express.Router()
router.use(authentication)

router.post(
    '',
    grantAccess('createAny', 'lesson'),
    asyncHandler(lessonController.createLesson)
)
router.post(
    '/all',
    grantAccess('readAny', 'lesson'),
    asyncHandler(lessonController.getAllLesson)
) //? thay the bang all releases lesson
router.post(
    '/:lesson_id',
    grantAccess('readAny', 'lesson'),
    asyncHandler(lessonController.getOneLesson)
)
router.patch(
    '/:id',
    grantAccess('updateAny', 'lesson'),
    asyncHandler(lessonController.updateLesson)
)
router.post(
    '/release/:id',
    grantAccess('updateAny', 'lesson'),
    asyncHandler(lessonController.releaseLesson)
)
router.post(
    '/unRelease/:id',
    grantAccess('updateAny', 'lesson'),
    asyncHandler(lessonController.unReleaseLesson)
)
//QUERY//
/**
 * @desc get all darft of lesson (All no need id course)
 * @param {Number} limit
 * @param {Number} skip
 * @return {JSON}
 */
router.get(
    '/drafts/all',
    grantAccess('readAny', 'lesson_draft'),
    asyncHandler(lessonController.getAllDraftLesson)
)
router.get(
    '/release/all/:course_id',
    grantAccess('readAny', 'lesson'),
    asyncHandler(lessonController.getAllReleaseLesson)
)
//END QUERY//))

module.exports = router
