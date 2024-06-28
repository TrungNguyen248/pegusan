'use strict'

const { Schema, model } = require('mongoose')
const { JapaneseToUnicode } = require('../utils')

const DOCUMENT_NAME = 'Hina'
const COLLECTION_NAME = 'Hinas'

const hinaSchema = new Schema(
    {
        course: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
        },
        lesson_id: String,
        lesson_title: String,
        name_type: {
            type: Number,
            enum: [0, 1], //0: hiragana, 1: katakana
        },
        points: Number,
        words: [
            {
                word: String,
                trans: String,
                audio: String,
                svg_path: [String],
                note: String,
            },
        ],
        questions: [
            {
                content: String,
                image: String,
                trans: String,
                sentence: String,
                value: String,
                quiz: [String],
                point: Number,
            },
        ],
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
)

//before save document
hinaSchema.pre('save', async function (next) {
    this.svg_path = JapaneseToUnicode(this.word)
    this.words.forEach((w) => {
        w.svg_path.forEach((v, i) => {
            w.svg_path[i] = `colorized-kanji-stroke/${v}.svg`
        })
    })
})

module.exports = model(DOCUMENT_NAME, hinaSchema)
