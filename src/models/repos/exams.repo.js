'use strict'

const examsModel = require('../exams.model')

const findExamsByTag_Level = async (tags, level) => {
    return await examsModel
        .find({ tags: tags, level: level, isPublish: true })
        .select('-contents ')
}

const createExams = async (bodyData) => {
    return await examsModel.create(bodyData)
}

const findExamsById = async (id) => {
    return await examsModel.findById(id).select('tags title contents -_id')
}

const updateExams = async (exam_id, bodyUpdate, isNew = true) => {
    return await examsModel.findByIdAndUpdate(exam_id, bodyUpdate, {
        new: isNew,
    })
}

const deleteExams = async (exam_id) => {
    return await examsModel.deleteOne({ _id: exam_id })
}

module.exports = {
    createExams,
    updateExams,
    findExamsById,
    deleteExams,
    findExamsByTag_Level,
}
