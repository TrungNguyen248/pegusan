'use strict'

const { model, Schema, Types } = require('mongoose') // Erase if already required

const DOCUMENT_NAME = 'Lesson'
const COLLECTION_NAME = 'Lessons'

// Declare the Schema of the Mongo model
const lessonSchema = new Schema(
    {
        course: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
        },
        lesson_title: {
            type: String,
            required: true,
        },
        contents: {
            vocabulary: {
                type: Array,
            },
            grammar: {
                type: Array,
            },
            kaiwa: {
                type: Array, // TODO later
            },
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
)

//Export the model
module.exports = model(DOCUMENT_NAME, lessonSchema)
