'use strict'

const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'Schedule'
const COLLECTION_NAME = 'Schedules'

const scheduleSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        object_str: [String],
        words: [
            {
                tags: String,
                word: {
                    type: Schema.Types.ObjectId,
                    required: true,
                    ref: 'Vocabulary',
                },
                reviewDate: Date, //ngay review gan nhat
                interval: Number, //so ngay tinh tu ngay review gan nhat
            },
        ],
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
)

module.exports = model(DOCUMENT_NAME, scheduleSchema)
