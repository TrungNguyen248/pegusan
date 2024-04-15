const { Schema, model } = require('mongoose')
const { kanjiToUnicode } = require('../utils')
const lessonModel = require('./lesson.model')

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
        hex_string: {
            type: Array,
            default: [],
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

//before save document
vocabularySchema.pre('save', async function (next) {
    this.hex_string = kanjiToUnicode(this.kanji)
})

module.exports = model(DOCUMENT_NAME, vocabularySchema)
