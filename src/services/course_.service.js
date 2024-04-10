'use strict'

const courseModel = require('../models/course.model')

const findByName = async (name) => {
    return await courseModel.findOne({ name }).lean()
}

const getAll = async () => {
    return await courseModel.find().lean()
}

module.exports = {
    findByName,
    getAll,
}
