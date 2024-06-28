'use strict'

const { model, Schema } = require('mongoose') // Erase if already required
const flashcardModel = require('./flashcard.model')

const DOCUMENT_NAME = 'Deck'
const COLLECTION_NAME = 'Decks'

// Declare the Schema of the Mongo model
const deckSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        deck_title: { type: String, required: true },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
)

//Export the model
module.exports = model(DOCUMENT_NAME, deckSchema)
