'use strict'

const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'Point'
const COLLECTION_NAME = 'Points'

const pointSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        total_point: {
            type: Number,
        },
        weeklyScores: [
            {
                week: { type: Number, required: true },
                year: { type: Number, required: true },
                point: { type: Number, required: true, default: 0 },
            },
        ],
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
)

module.exports = model(DOCUMENT_NAME, pointSchema)
