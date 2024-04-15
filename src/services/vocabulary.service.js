'use strict'

const { findLessonById, getAllVocab } = require('./course_.service')
const vocabularyModel = require('../models/vocab.model')
const { BadRequestError } = require('../core/error.response')
const {
    updateVocab,
    addVocabIdToLesson,
} = require('../models/repos/vocab.repo')
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
        await addVocabIdToLesson(lesson_id, newVocab._id)
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
        const vocabExists = await vocabularyModel
            .findOne({ lesson: lesson_id, word: bodyUpdate?.word })
            .lean()

        if (vocabExists) {
            if (vocabExists._id != vocab_id) {
                throw new BadRequestError('Word already exists')
            } else {
                if (bodyUpdate?.kanji) {
                    bodyUpdate.hex_string = kanjiToUnicode(bodyUpdate?.kanji)
                }
                return updateVocab(
                    vocab_id,
                    removeUnderfinedObjectKey(bodyUpdate)
                )
            }
        } else {
            throw new BadRequestError('No word found')
        }
    }
}

module.exports = VocabularyService
