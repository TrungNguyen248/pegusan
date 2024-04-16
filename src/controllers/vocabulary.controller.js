'use strict'

const { CREATED, SuccessResponse } = require('../core/success.response')
const VocabularyService = require('../services/vocabulary.service')

class VocabularyController {
    add = async (req, res, next) => {
        new CREATED({
            message: 'add vocabulary successfully',
            metadata: await VocabularyService.add(req.body),
        }).send(res)
    }
    getAll = async (req, res, next) => {
        new SuccessResponse({
            message: 'get all vocabulary successfully',
            metadata: await VocabularyService.getAll(req.params.lesson_id),
        }).send(res)
    }
    updateVocab = async (req, res, next) => {
        new SuccessResponse({
            message: 'update vocabulary successfully',
            metadata: await VocabularyService.updateVocab(req.params.id, {
                ...req.body,
            }),
        }).send(res)
    }
    deleteVocab = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete Vocab successfully',
            metadata: await VocabularyService.deleteVocab(req.params.id, {
                ...req.body,
            }),
        }).send(res)
    }
}

module.exports = new VocabularyController()
