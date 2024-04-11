'use strict'

const express = require('express')
const courseController = require('../../controllers/course.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const lessonController = require('../../controllers/lesson.controller')
const vocabularyController = require('../../controllers/vocabulary.controller')
//const { authentication } = require("../../auth/authUtils")

const router = express.Router()
//authentication
//router.use(authentication)

router.post('/all', asyncHandler(courseController.getAllCourse))
router.post('', asyncHandler(courseController.createCourse))

//lesson
router.post('/lesson', asyncHandler(lessonController.createLesson))
router.post('/lesson/all', asyncHandler(lessonController.getAllLesson))

//vocabulary
router.post('/lesson/vocab/', asyncHandler(vocabularyController.getAll))
router.post('/lesson/vocab/add', asyncHandler(vocabularyController.add))

module.exports = router
