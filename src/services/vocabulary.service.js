'use strict'

const { findLessonById, getAllVocab } = require('./course_.service')
const vocabularyModel = require('../models/vocab.model')
const { BadRequestError } = require('../core/error.response')
const { updateVocab } = require('../models/repos/vocab.repo')
const {
    addVocabIdToLesson,
    removeVocabIdFromLesson,
} = require('../models/repos/lesson.repo')
const { removeUnderfinedObjectKey, kanjiToUnicode } = require('../utils')

class VocabularyService {
    static add = async (lesson_id, bodyData) => {
        const vocabExists = await vocabularyModel
            .findOne({ lesson: lesson_id, word: bodyData.word })
            .lean()
        if (vocabExists) throw new BadRequestError('vocabulary already exists')
        const newVocab = await vocabularyModel.create({
            lesson: lesson_id,
            ...bodyData,
        })

        if (!newVocab) throw new BadRequestError('Somthing went wrong')
        await addVocabIdToLesson({ lesson_id, vocab_id: newVocab._id })
        return newVocab
    }

    static getAll = async (lesson_id) => {
        const lessonExists = await findLessonById(lesson_id)
        if (!lessonExists) throw new BadRequestError('Lesson not found!!')
        const listVocab = await getAllVocab(lesson_id)
        if (listVocab.length == 0) {
            return {
                message: 'No Vocab added',
            }
        }
        return listVocab
    }

    static updateVocab = async (lesson_id, vocab_id, bodyUpdate) => {
        const vocabById = await vocabularyModel
            .findOne({ _id: vocab_id })
            .lean()

        if (!vocabById) throw new BadRequestError('word not found')

        const vocabExists = await vocabularyModel
            .findOne({ lesson: lesson_id, word: bodyUpdate?.word })
            .lean()

        if (vocabExists) {
            if (vocabExists._id != vocab_id) {
                throw new BadRequestError('Word already exists')
            }
        }

        if (bodyUpdate?.kanji) {
            bodyUpdate.hex_string = kanjiToUnicode(bodyUpdate?.kanji)
        }
        return updateVocab(vocab_id, removeUnderfinedObjectKey(bodyUpdate))
    }

    static deleteVocab = async (lesson_id, vocab_id) => {
        const vocabExists = await vocabularyModel
            .findOne({ _id: vocab_id })
            .lean()
        if (!vocabExists) throw new BadRequestError('vocab not found')

        await removeVocabIdFromLesson({ lesson_id, vocab_id })

        await vocabularyModel.deleteOne({ _id: vocab_id })
    }
}

module.exports = VocabularyService
