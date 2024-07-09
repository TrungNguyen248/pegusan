const { Schema, model } = require('mongoose')
const { JapaneseToUnicode } = require('../utils')
const lessonModel = require('./lesson.model')

const DOCUMENT_NAME = 'Vocabulary'
const COLLECTION_NAME = 'Vocabularys'

const vocabularySchema = new Schema(
    {
        lesson: {
            type: Schema.Types.ObjectId,
            ref: 'Lesson',
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
        audio: {
            type: String,
        },
        example: {
            type: String,
        },
        tags: {
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
    this.hex_string = JapaneseToUnicode(this.kanji)
})

module.exports = model(DOCUMENT_NAME, vocabularySchema)
