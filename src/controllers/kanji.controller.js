'use strict'

const { SuccessResponse } = require('../core/success.response')
const {
    getAllKanjiService,
    allKanjiByLevel,
    kanjiByName,
    addKanjiService,
    getSvgContent,
} = require('../services/kanji.service')

const getAllKanji = async (req, res, next) => {
    new SuccessResponse({
        message: 'Get full kanji success',
        metadata: await getAllKanjiService(req.params.level),
    }).send(res)
}

const getSvgContentCtr = async (req, res, next) => {
    new SuccessResponse({
        message: 'Get content svg successfully',
        metadata: await getSvgContent(req.body),
    }).send(res)
}

const getAllKanjiByLevel = async (req, res, next) => {
    new SuccessResponse({
        message: 'Get list of Kanji successfully',
        metadata: await allKanjiByLevel(req.params.jlpt, req.params.page),
    }).send(res)
}

const addKanji = async (req, res, next) => {
    new SuccessResponse({
        message: 'Add Kanji successfully',
        metadata: await addKanjiService(req.body),
    }).send(res)
}

const getKanji = async (req, res, next) => {
    new SuccessResponse({
        message: 'Get kanji successfully',
        metadata: await kanjiByName(req.query),
    }).send(res)
}

module.exports = {
    getAllKanji,
    getKanji,
    addKanji,
    getAllKanjiByLevel,
    getSvgContentCtr,
}
