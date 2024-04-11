'use strict'

const { BadRequestError } = require('../core/error.response')
const {
    findLessonByTitle,
    findById,
    getAllLesson,
} = require('./course_.service')
const lessonModel = require('../models/lesson.model')

class LessonService {
    static createLesson = async ({ course_id, lesson_title }) => {
        const courseExist = findById(course_id)

        if (!courseExist) throw new BadRequestError('Course not found!!')

        const lessonExists = await findLessonByTitle(lesson_title)

        if (lessonExists) throw new BadRequestError('Lesson already exists')

        const newLesson = await lessonModel.create({
            course: course_id,
            lesson_title,
        })

        if (!newLesson) throw new BadRequestError('Something went wrong')

        return {
            newLesson,
        }
    }
    static getAll = async () => {
        const listLessons = await getAllLesson()
        if (listLessons.length == 0) {
            return {
                message: 'Lesson not found',
            }
        }
        return listLessons
    }
}

module.exports = LessonService
