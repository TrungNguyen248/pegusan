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

    getOneLesson = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get lesson successfully',
            metadata: await LessonService.getOneLesson(req.params.lesson_id),
        }).send(res)
    }

    getAllLesson = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get all lesson successfully',
            metadata: await LessonService.getAll(req.params.course_id),
        }).send(res)
    }

    updateLesson = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update lesson successfully',
            metadata: await LessonService.updateLesson(req.params.id, {
                ...req.body,
            }),
        }).send(res)
    }

    releaseLesson = async (req, res, next) => {
        new SuccessResponse({
            message: 'Release lesson successfully',
            metadata: await LessonService.releaseLesson(req.params.id),
        }).send(res)
    }
    unReleaseLesson = async (req, res, next) => {
        new SuccessResponse({
            message: 'Un Release lesson successfully',
            metadata: await LessonService.unReleaseLesson(req.params.id),
        }).send(res)
    }

    //QUERY
    getAllDraftLesson = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get all draft lesson successfully',
            metadata: await LessonService.findAllDraftLesson(),
        }).send(res)
    }

    getAllReleaseLesson = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get all Release lesson successfully',
            metadata: await LessonService.findAllReleaseLesson(
                req.params.course_id
            ),
        }).send(res)
    }

    //END QUERY
}

module.exports = new LessonController()
