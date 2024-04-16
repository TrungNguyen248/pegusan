'use strict'

const grammarModel = require('../grammar.model')

const updateGrammar = async (grammar_id, bodyUpdate, isNew = true) => {
    return await grammarModel.findByIdAndUpdate(grammar_id, bodyUpdate, {
        new: isNew,
    })
}

module.exports = {
    updateGrammar,
}
