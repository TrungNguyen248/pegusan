'use strict'

const { CREATED, SuccessResponse } = require('../core/success.response')
const LessonService = require('../services/lesson.service')

class LessonController {
    createLesson = async (req, res, next) => {
        new CREATED({
            message: 'Created lesson successfully',
            metadata: await LessonService.createLesson(req.params.course_id, {
                ...req.body,
            }),
        }).send(res)
    }
    getAllLesson = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get all lesson successfully',
            metadata: await LessonService.getAll(req.params.course_id),
        }).send(res)
    }

    //QUERY
    getAllDraftLesson = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get all draft lesson successfully',
            metadata: await LessonService.findAllDraftLesson(),
        }).send(res)
    }

    //END QUERY
}

module.exports = new LessonController()
