'use strict'

const { BadRequestError } = require('../core/error.response')
const {
    findLessonByTitle,
    findById,
    getAllLesson,
} = require('./course_.service')
const lessonModel = require('../models/lesson.model')
const { findAllDraftLesson } = require('../models/repos/lesson.repo')

class LessonService {
    static createLesson = async (course_id, { lesson_title }) => {
        const courseExist = await findById(course_id)
        if (!courseExist) throw new BadRequestError('Course not found!!')

        const lessonExists = await findLessonByTitle(course_id, lesson_title)
        if (lessonExists) throw new BadRequestError('Lesson already exists')

        const newLesson = await lessonModel.create({
            course: course_id,
            lesson_title,
        })

        if (!newLesson) throw new BadRequestError('Something went wrong')

        return newLesson
    }

    static getAll = async (course_id) => {
        const listLessons = await getAllLesson(course_id)
        if (listLessons.length == 0) {
            return {
                message: 'Lesson not found',
            }
        }
        return listLessons
    }

    static async findAllDraftLesson(limit = 25, skip = 0) {
        const query = { isDraft: true }
        return await findAllDraftLesson({ query, limit, skip })
    }
}

module.exports = LessonService
