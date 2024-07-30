'use strict'

const grammarModel = require('../models/grammar.model')
const {
    addGrammarIdToLesson,
    removeGrammarIdFromLesson,
    findLessonById,
} = require('../models/repos/lesson.repo')
const { BadRequestError, NotFoundError } = require('../core/error.response')
const { removeUnderfinedObjectKey, convert2ObjectId } = require('../utils')
const {
    updateGrammar,
    getAllGrammarByLesson,
} = require('../models/repos/grammar.repo')

class GrammarService {
    static addGrammar = async ({ lesson_id, ...bodyData }) => {
        const grammarExists = await grammarModel
            .findOne({
                lesson: convert2ObjectId(lesson_id),
                structure: bodyData.structure,
            })
            .lean()
        //console.log(grammarExists)
        if (grammarExists) throw new BadRequestError('Grammar already exists')

        if (lesson_id) {
            const newGrammar = await grammarModel.create({
                lesson: lesson_id,
                ...bodyData,
            })
            if (!newGrammar) throw new BadRequestError('Somthing went wrong')
            await addGrammarIdToLesson({
                lesson_id,
                grammar_id: newGrammar._id,
            })
            return newGrammar
        } else {
            return await grammarModel.create(bodyData)
        }
    }

    static getGrammarByLevel = async (level, page, limit = 12) => {
        if (page >= 1) {
            const grammars = await grammarModel
                .find({
                    level: level.toUpperCase(),
                })
                .limit(limit)
                .skip(limit * (page - 1))
            const count = await grammarModel.countDocuments({
                level: level.toUpperCase(),
            })
            if (grammars.length <= 0)
                throw new NotFoundError('No grammar found for level ' + level)
            return { grammars: grammars, count: count }
        }
    }

    static getAllGrammar = async ({ lesson_id }) => {
        const foundLesson = await findLessonById(lesson_id)

        if (!foundLesson) throw new NotFoundError('Not found lesson')

        const listGrammar = await getAllGrammarByLesson(lesson_id)

        if (listGrammar.length == 0) return {}

        return listGrammar
    }

    static updateGrammar = async (grammar_id, { lesson_id, ...bodyUpdate }) => {
        const grammarById = await grammarModel
            .findById(convert2ObjectId(grammar_id))
            .lean()
        if (!grammarById) throw new NotFoundError('Grammar not found')

        const grammarExist = await grammarModel
            .findOne({
                lesson: convert2ObjectId(lesson_id),
                structure: bodyUpdate?.structure,
            })
            .lean()
        if (grammarExist) {
            if (grammarExist._id != grammar_id) {
                throw new BadRequestError('Grammar already exists')
            }
        }
        return await updateGrammar(
            grammar_id,
            removeUnderfinedObjectKey(bodyUpdate)
        )
    }

    static deleteGrammar = async (grammar_id, { lesson_id }) => {
        const grammarExist = await grammarModel
            .findById(convert2ObjectId(grammar_id))
            .lean()
        if (!grammarExist) throw new NotFoundError('Grammar not found')

        await removeGrammarIdFromLesson({ lesson_id, grammar_id })

        await grammarModel.deleteOne({ _id: grammar_id })

        return true
    }
}

module.exports = GrammarService
