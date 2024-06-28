'use strict'

const hinaModel = require('../hina.model')

const findHinaByLessonId = async (lesson_id) => {
    return await hinaModel.findOne({ lesson_id: lesson_id })
}

const createHina = async (course_id, bodyData) => {
    return await hinaModel.create({
        course: course_id,
        ...bodyData,
    })
}

module.exports = {
    findHinaByLessonId,
    createHina,
}
