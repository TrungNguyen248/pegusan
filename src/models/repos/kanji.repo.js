'use strict'

const kanjiModel = require('../kanji.model')

const addKanji = async (data) => {
    return await kanjiModel.create(data)
}

const getAllKanjiByLevel = async (level, page, limit = 25) => {
    const result = await kanjiModel
        .find({ jlpt: level })
        .limit(limit)
        .skip(limit * (page - 1))
    const count = await kanjiModel.countDocuments({
        jlpt: level,
    })
    return { kanji: result, count: count }
}

const getKanji = async (kanji) => {
    return await kanjiModel.findOne({ kanji: kanji }).lean()
}

module.exports = {
    getAllKanjiByLevel,
    getKanji,
    addKanji,
}
