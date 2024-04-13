'use strict'

const lessonModel = require('../lesson.model')

const findAllDraftLesson = async ({ query, limit, skip }) => {
    return await lessonModel
        .find(query)
        .populate('course', 'name author -_id')
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

module.exports = {
    findAllDraftLesson,
}
