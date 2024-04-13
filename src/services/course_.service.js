'use strict'

const courseModel = require('../models/course.model')
const lessonModel = require('../models/lesson.model')
const { Types } = require('mongoose')
const vocabModel = require('../models/vocab.model')

//course
const findByName = async (name) => {
    return await courseModel.findOne({ name }).lean()
}

const findById = async (_id) => {
    return await courseModel.findOne({ _id }).lean()
}

const getAll = async () => {
    return await courseModel.find().lean()
}

//lessons
const findLessonByTitle = async (course_id, lesson_title) => {
    return await lessonModel.findOne({ course: course_id, lesson_title }).lean()
}

const findLessonById = async (lesson_id) => {
    return await lessonModel.findOne({ _id: new Types.ObjectId(lesson_id) })
}

const getAllLesson = async (course_id) => {
    return await lessonModel.find({ course: course_id }).lean()
}

//vocab
const getAllVocab = async (lesson_id) => {
    return await vocabModel.find({ lesson: lesson_id }).lean()
}

module.exports = {
    findByName,
    findById,
    getAll,
    findLessonByTitle,
    findLessonById,
    getAllLesson,
    getAllVocab,
}
