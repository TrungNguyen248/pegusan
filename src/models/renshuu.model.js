'use strict'

const { model, Schema } = require('mongoose')

const DOCUMENT_NAME = 'Renshuu'
const COLLECTION_NAME = 'Renshuus'

const renshuuSchema = new Schema(
    {
        title: { type: String },
        lesson: {
            type: Schema.Types.ObjectId,
            ref: 'Lesson',
        },
        total_points: {
            type: Number,
            required: true,
        },
        contents: [
            {
                content_text: { type: String, required: true },
                point: { type: Number, required: true },
                value: { type: String, required: true },
                url_audio: { type: String, default: null },
                quiz: { type: Array, required: true },
            },
        ],
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
)

module.exports = model(DOCUMENT_NAME, renshuuSchema)
