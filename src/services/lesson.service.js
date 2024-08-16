'use strict'

const { BadRequestError, NotFoundError } = require('../core/error.response')
const lessonModel = require('../models/lesson.model')
const courseModel = require('../models/course.model')
const { removeUnderfinedObjectKey, convert2ObjectId } = require('../utils')
const { getAllLesson } = require('../models/repos/lesson.repo')
const {
    findAllDraftLesson,
    releaseLesson,
    unReleaseLesson,
    findAllReleaseLesson,
    updateLesson,
    findOneLesson,
} = require('../models/repos/lesson.repo')
const hinaModel = require('../models/hina.model')
const progressModel = require('../models/progress.model')
const { forEach } = require('lodash')

class LessonService {
    static createLesson = async ({ course_id, lesson_title, ...bodyData }) => {
        const courseExist = await courseModel.findById(
            convert2ObjectId(course_id)
        )

        if (!courseExist) throw new NotFoundError('Course not found!!')

        const lessonExists = await lessonModel.findOne({
            course: convert2ObjectId(course_id),
            lesson_title,
        })
        if (lessonExists) throw new BadRequestError('Lesson already exists')

        const newLesson = await lessonModel.create({
            course: course_id,
            lesson_title,
            bodyData,
        })

        if (!newLesson) throw new BadRequestError('Something went wrong')

        return newLesson
    }

    static getAll = async ({ userId, course_id }) => {
        const courseExist = await courseModel
            .findById(convert2ObjectId(course_id))
            .select('name type')
            .lean()
        if (!courseExist) throw new NotFoundError('Course not found!!')

        const userProgression = await progressModel.findOne({
            user: convert2ObjectId(userId),
        })
        const listRegistered = userProgression.progress
        if (courseExist.type == 'Hina') {
            let listLessons = await hinaModel
                .find({
                    course: course_id,
                })
                .select('lesson_id lesson_title')
                .lean()

            let ls = []
            for (let i = 0; i < listRegistered.length; i++) {
                if (
                    course_id.toString() === listRegistered[i].course.toString()
                ) {
                    ls = listRegistered[i].lessons
                }
            }

            listLessons.forEach((lesson, idx) => {
                for (let i = 0; i < ls.length; i++) {
                    if (lesson._id.toString() === ls[i].toString()) {
                        listLessons[idx] = {
                            ...listLessons[idx],
                            learnt: true,
                        }
                    }
                }
            })
            return {
                course: courseExist,
                listLessons: listLessons,
                type: 'Hina',
            }
        } else {
            let listLessons = await getAllLesson(course_id)

            if (listLessons.length == 0) {
                return null
            }
            return {
                course: courseExist,
                listLessons: listLessons,
                type: 'Mina',
            }
        }
    }
    static getOneLesson = async (lesson_id) => {
        const lessonExists = await findOneLesson(lesson_id)
        if (!lessonExists) throw new NotFoundError('lesson not found')
        return lessonExists
    }
    //Patch
    static updateLesson = async (lesson_id, { course_id, ...bodyUpdate }) => {
        const lessonById = await lessonModel.findById(
            convert2ObjectId(lesson_id)
        )
        if (!lessonById) throw new NotFoundError('lesson not found')
        const lessonExists = await lessonModel.findOne({
            course: course_id,
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
