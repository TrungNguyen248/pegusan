'use strict'

const { model, Schema } = require('mongoose') // Erase if already required

const DOCUMENT_NAME = 'Course'
const COLLECTION_NAME = 'Courses'

// Declare the Schema of the Mongo model
const courseSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        thumb: {
            type: String,
            //required: true,
        },
        user: {
            type: Schema.Types.Object,
            ref: 'User',
        },
        author: {
            type: String,
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
)

//Export the model
module.exports = model(DOCUMENT_NAME, courseSchema)
