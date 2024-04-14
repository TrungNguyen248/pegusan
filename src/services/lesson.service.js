'use strict'

const { BadRequestError } = require('../core/error.response')
const lessonModel = require('../models/lesson.model')
const { removeUnderfinedObjectKey } = require('../utils')
const {
    findLessonByTitle,
    findById,
    getAllLesson,
} = require('./course_.service')
const {
    findAllDraftLesson,
    releaseLesson,
    unReleaseLesson,
    findAllReleaseLesson,
    updateLesson,
} = require('../models/repos/lesson.repo')

class LessonService {
    static createLesson = async (course_id, { lesson_title }) => {
        const courseExist = await findById(course_id)
        if (!courseExist) throw new BadRequestError('Course not found!!')

        const lessonExists = await findLessonByTitle({
            course_id,
            lesson_title,
        })
        if (lessonExists) throw new BadRequestError('Lesson already exists')

        const newLesson = await lessonModel.create({
            course: course_id,
            lesson_title,
        })

        if (!newLesson) throw new BadRequestError('Something went wrong')

        return newLesson
    }

    static getAll = async (course_id) => {
        const courseExist = await findById(course_id)
        if (!courseExist) throw new BadRequestError('Course not found!!')
        const listLessons = await getAllLesson(course_id)

        if (listLessons.length == 0) {
            return {
                message: 'Lesson not found',
            }
        }
        return listLessons
    }
    //Patch
    static updateLesson = async (course_id, lesson_id, bodyUpdate) => {
        const lessonExists = await findLessonByTitle({
            course_id,
            lesson_title: bodyUpdate?.lesson_title,
        })
        if (lessonExists) {
            if (lessonExists._id != lesson_id)
                throw new BadRequestError('lesson already exists')
        }

        return await updateLesson(
            lesson_id,
            removeUnderfinedObjectKey(bodyUpdate)
        )
    }
    //End Patch

    //Put
    static releaseLesson = async (lesson_id) => {
        return await releaseLesson(lesson_id)
    }
    static unReleaseLesson = async (lesson_id) => {
        return await unReleaseLesson(lesson_id)
    }
    //End put

    //Query
    static async findAllDraftLesson(limit = 25, skip = 0) {
        const query = { isDraft: true }
        return await findAllDraftLesson({ query, limit, skip })
    }

    static async findAllReleaseLesson(course_id, limit = 25, skip = 0) {
        const query = { course: course_id, isRelease: true }
        return await findAllReleaseLesson({ query, limit, skip })
    }
    //End query
}

module.exports = LessonService
