'use strict'

const { model, Schema } = require('mongoose') // Erase if already required
const slugify = require('slugify')

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
        course_slug: {
            type: String,
        },
        author: {
            type: String,
        },
        stu_num: {
            type: Number,
            default: 0,
        },
        type: String,
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
)
//before save document
courseSchema.pre('save', function (next) {
    this.course_slug = slugify(this.name, { lower: true })
    next()
})

//Export the model
module.exports = model(DOCUMENT_NAME, courseSchema)
