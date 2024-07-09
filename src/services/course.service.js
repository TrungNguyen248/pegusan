'use strict'

const { updateCourse } = require('../models/repos/course.repo')
const { findByName, getAll } = require('../models/repos/course.repo')
const userModel = require('../models/user.model')

const { removeUnderfinedObjectKey, convert2ObjectId } = require('../utils')
const {
    BadRequestError,
    NotFoundError,
    AuthFailureError,
} = require('../core/error.response')
const courseModel = require('../models/course.model')
const { pushNotiToSystem } = require('./notification.service')
const progressModel = require('../models/progress.model')

class CourseService {
    static registerCourse = async ({ userId, courseId }) => {
        const userExist = await userModel.findById(convert2ObjectId(userId))
        if (!userExist)
            throw new AuthFailureError('AuthFailureError: User not found')
        const foundCourse = await courseModel.findById(
            convert2ObjectId(courseId)
        )
        if (!foundCourse) throw new NotFoundError('Course not found')

        const userProgression = await progressModel.findOne({
            user: convert2ObjectId(userId),
        })

        userProgression.progress.forEach((prog) => {
            if (prog.course.toString() == courseId) {
                throw new BadRequestError(
                    'BadRequestError: Course already registered'
                )
            }
        })
        foundCourse.stu_num += 1
        await foundCourse.save()
        userProgression.progress.push({
            course: convert2ObjectId(courseId),
        })

        await userProgression.save()
        return 1
    }
    static getAllCourse = async ({ userId }) => {
        const listCourses = await getAll()
        if (listCourses.length == 0) return null

        const userProgression = await progressModel.findOne({
            user: convert2ObjectId(userId),
        })

        const listRegistered = userProgression?.progress

        listCourses.forEach((course, idx) => {
            for (let i = 0; i < listRegistered.length; i++) {
                if (
                    course._id.toString() ===
                    listRegistered[i].course.toString()
                ) {
                    listCourses[idx] = {
                        ...listCourses[idx],
                        registered: true,
                    }
                }
            }
        })

        return listCourses
    }
    static createCourse = async ({ name, thumb, user }) => {
        //check course exists
        const courseExist = await findByName(name)
        if (courseExist) {
            throw new BadRequestError('Error: Course name already exists')
        }

        const author = await userModel.findById(user).lean()

        const newCourse = await courseModel.create({
            name,
            thumb: '',
            user: user.userId,
            author: author.name,
        })
        //push notification
        pushNotiToSystem({
            type: 'COURSE-001',
            receivedId: 1,
            senderId: user.userId,
            options: {
                course_name: newCourse.name,
                author: author.name,
            },
        })
            .then((rs) => console.log(rs))
            .catch((err) => console.error(err))
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
