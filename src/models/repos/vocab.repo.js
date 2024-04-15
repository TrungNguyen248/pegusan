'use strict'

const vocabularyModel = require('../vocab.model')
const lessonModel = require('../lesson.model')

const updateVocab = async (vocab_id, bodyUpdate, isNew = true) => {
    return await vocabularyModel.findByIdAndUpdate(vocab_id, bodyUpdate, {
        new: isNew,
    })
}

const addVocabIdToLesson = async (lesson_id, vocab_id) => {
    const lessonExists = await lessonModel.findOne({ _id: lesson_id })
    lessonExists.contents.vocabulary.push(vocab_id)
    await lessonExists.save()
}

module.exports = {
    updateVocab,
    addVocabIdToLesson,
}
