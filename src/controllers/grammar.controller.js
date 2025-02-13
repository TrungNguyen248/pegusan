'use strict'

const GrammarService = require('../services/grammar.service')
const { SuccessResponse } = require('../core/success.response')

class GrammarController {
    add = async (req, res, next) => {
        new SuccessResponse({
            message: 'add grammar successfully',
            metadata: await GrammarService.addGrammar(req.body),
        }).send(res)
    }

    getAll = async (req, res, next) => {
        new SuccessResponse({
            message: 'get all grammar',
            metadata: await GrammarService.getAllGrammar(req.body),
        }).send(res)
    }

    getGrammarByLv = async (req, res, next) => {
        new SuccessResponse({
            message: 'get grammar byLv successfully',
            metadata: await GrammarService.getGrammarByLevel(
                req.params.level,
                req.params.page
            ),
        }).send(res)
    }

    updateGrammar = async (req, res, next) => {
        new SuccessResponse({
            message: 'Grammar updated successfully',
            metadata: await GrammarService.updateGrammar(req.params.id, {
                ...req.body,
            }),
        }).send(res)
    }
    deleteGrammar = async (req, res, next) => {
        new SuccessResponse({
            message: 'delete grammar successfully',
            metadata: await GrammarService.deleteGrammar(req.params.id, {
                ...req.body,
            }),
        }).send(res)
    }
}

module.exports = new GrammarController()
