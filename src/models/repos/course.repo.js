'use strict'
const courseModel = require('../course.model')

const updateCourse = async (course_id, bodyUpdate, isNew = true) => {
    return await courseModel.findByIdAndUpdate(course_id, bodyUpdate, {
        new: isNew,
    })
}

const findById = async (course_id) => {
    return await courseModel.findById(course_id).lean()
}

const findByName = async (name) => {
    return await courseModel.findOne({ name }).lean()
}

const getAll = async () => {
    return await courseModel.find().lean()
}

module.exports = {
    findById,
    updateCourse,
    findByName,
    getAll,
}
