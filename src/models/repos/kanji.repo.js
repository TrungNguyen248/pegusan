'use strict'

const kanjiModel = require('../kanji.model')

const addKanji = async (data) => {
    return await kanjiModel.create(data)
}

const getAllKanjiByLevel = async (level, limit = 30) => {
    return await kanjiModel.find({ jlpt: level }).limit(limit).exec()
}

const getKanji = async (kanji) => {
    return await kanjiModel.findOne({ kanji: kanji }).lean()
}

module.exports = {
    getAllKanjiByLevel,
    getKanji,
    addKanji,
}
