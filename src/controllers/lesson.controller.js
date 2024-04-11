'use strict'

const { CREATED, SuccessResponse } = require('../core/success.response')
const LessonService = require('../services/lesson.service')

class LessonController {
    createLesson = async (req, res, next) => {
        new CREATED({
            message: 'Created lesson successfully',
            metadata: await LessonService.createLesson(req.body),
        }).send(res)
    }
    getAllLesson = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get all lesson successfully',
            metadata: await LessonService.getAll(),
        }).send(res)
    }
}

module.exports = new LessonController()
