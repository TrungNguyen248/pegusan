'use strict'

const express = require('express')
const courseController = require('../../controllers/course.controller')
const asyncHandler = require('../../helpers/asyncHandler')
//const { authentication } = require("../../auth/authUtils")

const router = express.Router()
//authentication
//router.use(authentication)

router.post('/all', asyncHandler(courseController.getAllCourse))
router.post('', asyncHandler(courseController.createCourse))

module.exports = router
