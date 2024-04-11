'use strict'

const courseModel = require('../models/course.model')
const lessonModel = require('../models/lesson.model')
const { Types } = require('mongoose')
const vocabModel = require('../models/vocab.model')

//course
const findByName = async (name) => {
    return await courseModel.findOne({ name }).lean()
}

const findById = async (id) => {
    return await courseModel.findOne({ id }).lean()
}

const getAll = async () => {
    return await courseModel.find().lean()
}

//lessons
const findLessonByTitle = async (lesson_title) => {
    return await lessonModel.findOne({ lesson_title }).lean()
}

const findLessonById = async (lesson_id) => {
    return await lessonModel.findOne({ _id: new Types.ObjectId(lesson_id) })
}

const getAllLesson = async () => {
    return await lessonModel.find().lean()
}

//vocab
const getAllVocab = async () => {
    return await vocabModel.find().lean()
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
