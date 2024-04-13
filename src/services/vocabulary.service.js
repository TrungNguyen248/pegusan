'use strict'

const { findLessonById, getAllVocab } = require('./course_.service')
const vocabularyModel = require('../models/vocab.model')
const lessonModel = require('../models/lesson.model')
const { BadRequestError } = require('../core/error.response')

class VocabularyService {
    static add = async (
        lesson_id,
        { word, kanji, kana, meaning, category, example, notes = null }
    ) => {
        const lessonExists = await findLessonById(lesson_id)
        if (!lessonExists) throw new BadRequestError('Lesson not found!!')

        const newVocab = await vocabularyModel.create({
            lesson: lesson_id,
            word,
            kanji,
            kana,
            meaning,
            category,
            example,
            notes,
        })

        /* Check trungf tuwf */
        /* tach tu kanji -> unicode -> hex */
        /* luu vao db array chua ma hex cua tung tu */

        if (!newVocab) throw new BadRequestError('Somthing went wrong')
        lessonExists.contents.vocabulary.push(newVocab._id)
        await lessonExists.save()

        return newVocab
    }

    static getAll = async (lesson_id) => {
        const listVocab = await getAllVocab(lesson_id)
        if (listVocab.length == 0) {
            return {
                message: 'No Vocab added',
            }
        }
        return listVocab
    }
}

module.exports = VocabularyService
