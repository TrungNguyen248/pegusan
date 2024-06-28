const { model, Schema } = require('mongoose')

const top10Schema = new Schema({
    week: { type: Number, required: true },
    year: { type: Number, required: true },
    top10: [
        {
            name: { type: String, required: true },
            avatar: { type: String },
            point: { type: Number, required: true },
            rank: Number,
        },
    ],
})

module.exports = model('Top10', top10Schema)
