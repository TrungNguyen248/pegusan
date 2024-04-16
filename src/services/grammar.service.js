'use strict'

const grammarModel = require('../models/grammar.model')
const { addGrammarIdToLesson } = require('../models/repos/lesson.repo')
const { BadRequestError } = require('../core/error.response')
const { removeUnderfinedObjectKey } = require('../utils')
const { updateGrammar } = require('../models/repos/grammar.repo')

class GrammarService {
    static addGrammer = async (lesson_id, bodyData) => {
        const grammarExists = await grammarModel
            .findOne({ lesson: lesson_id, structure: bodyData.structure })
            .lean()
        if (grammarExists) throw new BadRequestError('Grammar already exists')
        const newGrammar = await grammarModel.create({
            lesson: lesson_id,
            ...bodyData,
        })

        if (!newGrammar) throw new BadRequestError('Somthing went wrong')

        await addGrammarIdToLesson({ lesson_id, grammar_id: newGrammar._id })

        return newGrammar
    }

    static updateGrammar = async (lesson_id, grammar_id, bodyUpdate) => {
        const grammarById = await grammarModel
            .findOne({ _id: grammar_id })
            .lean()

        if (!grammarById) throw new BadRequestError('Grammar not found')

        const grammarExist = await grammarModel
            .findOne({
                lesson: lesson_id,
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
}

module.exports = GrammarService
