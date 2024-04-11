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
            metadata: await VocabularyService.getAll(),
        }).send(res)
    }
}

module.exports = new VocabularyController()
