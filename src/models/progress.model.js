'use strict'

const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'Progression'
const COLLECTION_NAME = 'Progressions'

const progressSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        achievements: [
            {
                title: String,
                image: String,
            },
        ], //later
        progress: [
            {
                course: {
                    type: Schema.Types.ObjectId,
                    ref: 'Course',
                },
                lessons: [
                    {
                        type: Schema.Types.ObjectId,
                        refPath: 'progress.lessonType',
                    },
                ],
                lessonType: {
                    type: String,
                    required: true,
                    enum: ['Lesson', 'Hina'],
                },
            },
        ],
        examsProgress: [
            {
                exam: {
                    type: Schema.Types.ObjectId,
                    ref: 'Exam',
                },
                point: Number,
                note: String,
            },
        ],
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
)

module.exports = model(DOCUMENT_NAME, progressSchema)
