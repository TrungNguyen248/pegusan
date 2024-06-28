'use strict'

const vocabularyModel = require('../vocab.model')

const updateVocab = async (vocab_id, bodyUpdate, isNew = true) => {
    return await vocabularyModel.findByIdAndUpdate(vocab_id, bodyUpdate, {
        new: isNew,
    })
}

const getAllVocab = async (lesson_id) => {
    return await vocabModel.find({ lesson: lesson_id }).lean()
}
module.exports = {
    updateVocab,
    getAllVocab,
}
