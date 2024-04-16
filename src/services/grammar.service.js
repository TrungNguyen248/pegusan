'use strict'

const grammarModel = require('../models/grammar.model')
const {
    addGrammarIdToLesson,
    removeGrammarIdFromLesson,
} = require('../models/repos/lesson.repo')
const { BadRequestError, NotFoundError } = require('../core/error.response')
const { removeUnderfinedObjectKey } = require('../utils')
const { updateGrammar } = require('../models/repos/grammar.repo')
const { convert2ObjectId } = require('../utils')

class GrammarService {
    static addGrammar = async ({ lesson_id, ...bodyData }) => {
        const grammarExists = await grammarModel
            .findOne({
                lesson: convert2ObjectId(lesson_id),
                structure: bodyData.structure,
            })
            .lean()
        console.log(grammarExists)
        if (grammarExists) throw new BadRequestError('Grammar already exists')
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
