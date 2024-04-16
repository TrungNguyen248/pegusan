'use strict'

const { updateCourse } = require('../models/repos/course.repo')
const { findByName, getAll } = require('./course_.service')
const { findById } = require('./user.service')
const { removeUnderfinedObjectKey, convert2ObjectId } = require('../utils')
const { BadRequestError, NotFoundError } = require('../core/error.response')
const courseModel = require('../models/course.model')

class CourseService {
    static getAllCourse = async () => {
        const listCourses = await getAll()
        if (listCourses.length == 0) return null
        return listCourses
    }
    static createCourse = async ({ name, thumb, user }) => {
        //check course exists
        const courseExist = await findByName(name)
        if (courseExist) {
            throw new BadRequestError('Error: Course name already exists')
        }

        const author = await findById(user)

        const newCourse = await courseModel.create({
            name,
            thumb: '',
            user: user.userId,
            author: author.name,
        })

        if (!newCourse) throw new BadRequestError('Somthing went wrong')

        return newCourse
    }
    static updateCourse = async (course_id, bodyUpdate) => {
        const courseExist = await courseModel.findById(
            convert2ObjectId(course_id)
        )
        if (!courseExist) throw new NotFoundError('Course not found')
        return await updateCourse(
            course_id,
            removeUnderfinedObjectKey(bodyUpdate)
        )
    }
}

module.exports = CourseService
