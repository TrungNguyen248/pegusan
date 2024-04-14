'use strict'

const lessonModel = require('../lesson.model')
const { Types } = require('mongoose')

const updateLesson = async (lesson_id, bodyUpdate, isNew = true) => {
    return await lessonModel.findByIdAndUpdate(lesson_id, bodyUpdate, {
        new: isNew,
    })
}

const findAllDraftLesson = async ({ query, limit, skip }) => {
    return await queryLesson({ query, limit, skip })
}

const findAllReleaseLesson = async ({ query, limit, skip }) => {
    return await queryLesson({ query, limit, skip })
}

const queryLesson = async ({ query, limit, skip }) => {
    return await lessonModel
        .find(query)
        .populate('course', 'name author -_id')
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

const releaseLesson = async (lesson_id) => {
    const foundLesson = await lessonModel.findOne({
        _id: new Types.ObjectId(lesson_id),
    })

    if (!foundLesson) return null

    foundLesson.isRelease = true
    foundLesson.isDraft = false

    const { modifiedCount } = await lessonModel.updateOne(
        {
            _id: foundLesson._id,
        },
        foundLesson
    )

    return modifiedCount
}

const unReleaseLesson = async (lesson_id) => {
    const foundLesson = await lessonModel.findOne({
        _id: new Types.ObjectId(lesson_id),
    })

    if (!foundLesson) return null

    foundLesson.isRelease = false
    foundLesson.isDraft = true

    const { modifiedCount } = await lessonModel.updateOne(
        {
            _id: foundLesson._id,
        },
        foundLesson
    )

    return modifiedCount
}

module.exports = {
    findAllDraftLesson,
    releaseLesson,
    findAllReleaseLesson,
    unReleaseLesson,
    updateLesson,
}
