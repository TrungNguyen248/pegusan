'use strict'

const { SuccessResponse } = require('../core/success.response')
const {
    createRenshuu,
    updateRenshuu,
    updateRenshuuCase,
    delRenshuu,
} = require('../services/renshuu.service')

class GrammarController {
    createRenshuu = async (req, res, next) => {
        new SuccessResponse({
            message: 'create renshuu successfully',
            metadata: await createRenshuu(req.body),
        }).send(res)
    }
    updateRenshuu = async (req, res, next) => {
        new SuccessResponse({
            message: 'update successfully',
            metadata: await updateRenshuuCase(req.params.id, { ...req.body }),
        }).send(res)
    }
    deleteRenshuu = async (req, res, next) => {
        new SuccessResponse({
            message: 'Deleted Renshuu',
            metadata: await delRenshuu(req.params.id),
        }).send(res)
    }
}

module.exports = new GrammarController()
