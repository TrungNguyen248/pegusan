'use strict'
const courseModel = require('../course.model')

const updateCourse = async (course_id, bodyUpdate, isNew = true) => {
    return await courseModel.findByIdAndUpdate(course_id, bodyUpdate, {
        new: isNew,
    })
}

module.exports = {
    updateCourse,
}
