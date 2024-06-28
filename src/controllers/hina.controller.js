'use strict'

const { addHinaLesson, getHinaByLesson } = require('../services/hina.service')
const { SuccessResponse } = require('../core/success.response')

const addHina = async (req, res, next) => {
    new SuccessResponse({
        message: 'Create hina success',
        metadata: await addHinaLesson(req.body),
    }).send(res)
}

const getHina = async (req, res, next) => {
    new SuccessResponse({
        message: 'Get hina success',
        metadata: await getHinaByLesson(req.params.title),
    }).send(res)
}

const getHinaLesson = async (req, res, next) => {
    new SuccessResponse({
        message: 'Get hina lesson success',
        metadata: await getHinaByLesson(req.body),
    }).send(res)
}

module.exports = {
    addHina,
    getHina,
    getHinaLesson,
}
