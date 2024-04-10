'use strict'

const { CREATED, SuccessResponse } = require('../core/success.response')
const CourseService = require('../services/course.service')

class CourseController {
    createCourse = async (req, res, next) => {
        new CREATED({
            message: 'Course created successfully',
            metadata: await CourseService.createCourse({
                ...req.body,
                user: req.user.userId, //creater
            }),
        }).send(res)
    }
    getAllCourse = async (req, res, next) => {
        new SuccessResponse({
            message: 'successfully',
            metadata: await CourseService.getAllCourse(),
        }).send(res)
    }
}

module.exports = new CourseController()
