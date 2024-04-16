'use strict'

const courseModel = require('../models/course.model')
const lessonModel = require('../models/lesson.model')
const { Types } = require('mongoose')
const vocabModel = require('../models/vocab.model')
const { convert2ObjectId } = require('../utils')

//course
const findByName = async (name) => {
    return await courseModel.findOne({ name }).lean()
}

const getAll = async () => {
    return await courseModel.find().lean()
}

const findLessonById = async (lesson_id) => {
    return await lessonModel.findOne({ _id: convert2ObjectId(lesson_id) })
}

const getAllLesson = async (course_id) => {
    return await lessonModel
        .find({ course: convert2ObjectId(course_id) })
        .lean()
}

//vocab
const getAllVocab = async (lesson_id) => {
    return await vocabModel.find({ lesson: lesson_id }).lean()
}

module.exports = {
    findByName,
    getAll,
    findLessonById,
    getAllLesson,
    getAllVocab,
}
