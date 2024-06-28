'use strict'

const { SuccessResponse } = require('../core/success.response')
const ExamsService = require('../services/exams.service')

class ExamsController {
    getExamsByTagCtr = async (req, res, next) => {
        new SuccessResponse({
            message: 'get Exams by tag',
            metadata: await ExamsService.getExamsByTag({
                tags: req.params.tags,
                level: req.params.level,
            }),
        }).send(res)
    }

    getExamsByIdCtr = async (req, res, next) => {
        new SuccessResponse({
            message: 'get exam by id successfully',
            metadata: await ExamsService.getExamsById(req.params.id),
        }).send(res)
    }

    createExams = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create Exams',
            metadata: await ExamsService.createExams(req.body),
        }).send(res)
    }

    updateExams = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update Exams',
            metadata: await ExamsService.updateExamsCase(
                req.params.id,
                req.body
            ),
        }).send(res)
    }

    deleleExams = async (req, res, next) => {
        new SuccessResponse({
            message: 'Deleted exams',
            metadata: await ExamsService.delExams(req.params.id),
        }).send(res)
    }
}

module.exports = new ExamsController()
