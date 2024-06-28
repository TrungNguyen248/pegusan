'use strict'

const { model, Schema } = require('mongoose')

const DOCUMENT_NAME = 'Exam'
const COLLECTION_NAME = 'Exams'

/**
 * . title
 * . total point
 * . time limit (minutes)
 * .
 * . content {
 *  content_text
 *  point
 *  value
 *  url_audio
 *  quiz
 * }
 */

const examSchema = new Schema(
    {
        title: { type: String, required: true },
        time_limit: { type: Number },
        total_points: {
            type: Number,
            required: true,
        },
        level: { type: String, required: true },
        isPublish: { type: Boolean, default: false, select: false },
        tags: String,
        contents: [
            {
                type: { type: String },
                dokkai_text: { type: String, default: '' },
                dokkai_ask: [
                    {
                        content_text: { type: String },
                        value: { type: String },
                        quiz: { type: Array },
                        point: { type: Number, required: true },
                    },
                ],
                content_text: { type: String },
                point: { type: Number, required: true },
                value: { type: String },
                url_audio: { type: String, default: null },
                quiz: { type: Array },
            },
        ],
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
)

module.exports = model(DOCUMENT_NAME, examSchema)
