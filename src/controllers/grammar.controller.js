'use strict'

const GrammarService = require('../services/grammar.service')
const { SuccessResponse } = require('../core/success.response')

class GrammarController {
    add = async (req, res, next) => {
        new SuccessResponse({
            message: 'add grammar successfully',
            metadata: await GrammarService.addGrammer(req.params.lesson_id, {
                ...req.body,
            }),
        }).send(res)
    }
    updateGrammar = async (req, res, next) => {
        new SuccessResponse({
            message: 'Grammar updated successfully',
            metadata: await GrammarService.updateGrammar(
                req.params.lesson_id,
                req.params.id,
                {
                    ...req.body,
                }
            ),
        }).send(res)
    }
}

module.exports = new GrammarController()
