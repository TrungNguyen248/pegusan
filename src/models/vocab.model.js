const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'Vocabulary'
const COLLECTION_NAME = 'Vocabularys'

const vocabularySchema = new Schema(
    {
        lesson: {
            type: Schema.Types.ObjectId,
            ref: 'Lesson',
            required: true,
        },
        word: {
            type: String,
            required: true,
        },
        kanji: {
            type: String,
        },
        kana: {
            type: String, //phát âm ra hira và kata
            require: true,
        },
        meaning: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: [
                'noun',
                'verb',
                'adjective',
                'adverb',
                'preposition',
                'conjunction',
                'interjection',
            ],
            required: true,
        },
        example: {
            type: String,
        },
        notes: {
            type: String, //ghi chú (nếu có)
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
)

module.exports = model(DOCUMENT_NAME, vocabularySchema)
