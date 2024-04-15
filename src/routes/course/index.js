'use strict'

const express = require('express')
const courseController = require('../../controllers/course.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const vocabularyController = require('../../controllers/vocabulary.controller')
const { authentication } = require('../../auth/authUtils')

const router = express.Router()
router.use(authentication)

router.post('/all', asyncHandler(courseController.getAllCourse))
router.post('', asyncHandler(courseController.createCourse))
router.patch('/:course_id', asyncHandler(courseController.updateCourse))

module.exports = router
