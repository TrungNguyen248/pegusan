'use strict'

const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'leaderboard'
const COLLECTION_NAME = 'leaderboards'

const leaderboardSchema = new Schema(
    {
        week: { type: Number, required: true },
        year: { type: Number, required: true },
        top10: [
            {
                name: String,
                avatar: String,
                score: Number,
            },
        ],
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
)

module.exports = model(DOCUMENT_NAME, leaderboardSchema)
