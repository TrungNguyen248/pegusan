'use strict'

const vocabularyModel = require('../vocab.model')

const updateVocab = async (vocab_id, bodyUpdate, isNew = true) => {
    return await vocabularyModel.findByIdAndUpdate(vocab_id, bodyUpdate, {
        new: isNew,
    })
}

module.exports = {
    updateVocab,
}
