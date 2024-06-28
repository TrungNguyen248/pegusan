'use strict'

const grammarModel = require('../grammar.model')
const { convert2ObjectId } = require('../../utils')

const updateGrammar = async (grammar_id, bodyUpdate, isNew = true) => {
    return await grammarModel.findByIdAndUpdate(grammar_id, bodyUpdate, {
        new: isNew,
    })
}

const getAllGrammarByLesson = async (lesson_id) => {
    return await grammarModel.find({
        lesson: convert2ObjectId(lesson_id),
    })
}

module.exports = {
    updateGrammar,
    getAllGrammarByLesson,
}
