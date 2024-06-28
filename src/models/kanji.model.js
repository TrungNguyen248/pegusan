'use strict'

const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'Kanji'
const COLLECTION_NAME = 'Kanjis'

const kanjiSchema = new Schema(
    {
        kanji: String,
        cn_vi_word: String,
        component: [String],
        examples: [
            {
                ja: String,
                hira: String,
                vi: String,
            },
        ],
        explain: String,
        jlpt: String,
        kunyomi: [String],
        mean: String,
        onyomi: [String],
        stroke_num: Number,
        svg_path: String,
        unicode: String,
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
)

module.exports = model(DOCUMENT_NAME, kanjiSchema)
