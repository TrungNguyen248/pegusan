'use strict'

const express = require('express')
const courseController = require('../../controllers/course.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const lessonController = require('../../controllers/lesson.controller')
const vocabularyController = require('../../controllers/vocabulary.controller')
const { authentication } = require('../../auth/authUtils')

const router = express.Router()
authentication
router.use(authentication)

router.post('/all', asyncHandler(courseController.getAllCourse))
router.post('', asyncHandler(courseController.createCourse))
router.patch('/:course_id', asyncHandler(courseController.updateCourse))

//lesson
router.post(
    '/:course_id/lesson/all',
    asyncHandler(lessonController.getAllLesson)
)

router.post('/:course_id/lesson', asyncHandler(lessonController.createLesson))

//vocabulary
router.post('/lesson/:lesson_id/vocab/', asyncHandler(vocabularyController.add))
router.post(
    '/lesson/:lesson_id/vocab/all',
    asyncHandler(vocabularyController.getAll)
)

//QUERY//
/**
 * @desc get all darft of lesson (All no need id course)
 * @param {Number} limit
 * @param {Number} skip
 * @return {JSON}
 */
router.get('/drafts/all', asyncHandler(lessonController.getAllDraftLesson))
//END QUERY//

module.exports = router
