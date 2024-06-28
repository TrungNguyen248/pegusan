'use strict'

const { convert2ObjectId } = require('../../utils')
const renshuuModel = require('../renshuu.model')

const findRenshuuById = async ({ renshuu_id }) => {
    return await renshuuModel.findById(convert2ObjectId(renshuu_id)).lean()
}

const findRenshuuByTitle = async ({ title }) => {
    return await renshuuModel.findOne({ title }).lean()
}

const createRenshuu = async (bodyData) => {
    const newRenshuu = await renshuuModel.create(bodyData)
    return newRenshuu
}

const updateRenshuu = async (renshuu_id, bodyUpdate, isNew = true) => {
    return await renshuuModel.findByIdAndUpdate(renshuu_id, bodyUpdate, {
        new: isNew,
    })
}

const deleteRenshuu = async (renshuu_id) => {
    return await renshuuModel.deleteOne({ _id: renshuu_id })
}

module.exports = {
    createRenshuu,
    findRenshuuById,
    findRenshuuByTitle,
    updateRenshuu,
    deleteRenshuu,
}
