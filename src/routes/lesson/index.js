'use strict'

const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const lessonController = require('../../controllers/lesson.controller')
const { authentication } = require('../../auth/authUtils')

const router = express.Router()
router.use(authentication)

router.post('', asyncHandler(lessonController.createLesson))
router.post('/:lesson_id', asyncHandler(lessonController.getOneLesson))
router.post('/all/:course_id', asyncHandler(lessonController.getAllLesson)) //?
router.patch('/:id', asyncHandler(lessonController.updateLesson))
router.post('/release/:id', asyncHandler(lessonController.releaseLesson))
router.post('/unRelease/:id', asyncHandler(lessonController.unReleaseLesson))
//QUERY//
/**
 * @desc get all darft of lesson (All no need id course)
 * @param {Number} limit
 * @param {Number} skip
 * @return {JSON}
 */
router.get('/drafts/all', asyncHandler(lessonController.getAllDraftLesson))
router.get(
    '/release/all/:course_id',
    asyncHandler(lessonController.getAllReleaseLesson)
)
//END QUERY//))

module.exports = router
