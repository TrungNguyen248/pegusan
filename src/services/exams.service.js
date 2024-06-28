'use strict'

const { NotFoundError } = require('../core/error.response')
const {
    createExams,
    findExamsById,
    updateExams,
    deleteExams,
    findExamsByTag_Level,
} = require('../models/repos/exams.repo')
const { removeUnderfinedObjectKey } = require('../utils')
const examsModel = require('../models/exams.model')
const {
    convert2ObjectId,
    filterFieldToUpdate,
    filterFieldToUpdateNestedObject,
} = require('../utils')

class ExamsService {
    static getExamsByTag = async ({ tags, level }) => {
        const result = await findExamsByTag_Level(tags, level.toUpperCase())
        if (result.length <= 0) throw new NotFoundError('Not found exams')
        return result
    }

    static getExamsById = async (id) => {
        const result = await findExamsById(id)
        if (!result) throw new NotFoundError('Not found exam by id: ', id)
        return result
    }

    static createExams = async (bodyData) => {
        return await createExams(bodyData)
    }

    static updateExamsCase = async (exam_id, bodyUpdate) => {
        let result = {}
        const foundExams = await findExamsById(convert2ObjectId(exam_id))
        if (!foundExams) throw new NotFoundError('Exams not found')
        //const contents = bodyUpdate?.contents
        const { contents, ...updateData } = bodyUpdate
        const idToRemoves = updateData?.delete_arr
        if (idToRemoves && idToRemoves.length != 0) {
            await examsModel.updateOne(
                { _id: exam_id },
                {
                    $pull: {
                        contents: {
                            _id: { $in: idToRemoves },
                        },
                    },
                }
            )
        }

        if (updateData && updateData.length != 0) {
            const uddt = removeUnderfinedObjectKey(updateData)
            result = await examsModel.findByIdAndUpdate(
                exam_id,
                {
                    $set: uddt,
                },
                {
                    new: true,
                }
            )
        }

        if (contents && contents.length != 0) {
            await Promise.all(
                contents.map(async (content) => {
                    content = removeUnderfinedObjectKey(content)
                    if (content.content_id) {
                        if (content.dokkai_ask) {
                            await Promise.all(
                                content.dokkai_ask.map(async (dk_q) => {
                                    const dk_content =
                                        removeUnderfinedObjectKey(dk_q)
                                    if (dk_content.dokkai_id) {
                                        result =
                                            await examsModel.findByIdAndUpdate(
                                                exam_id,
                                                {
                                                    $set: {
                                                        ...filterFieldToUpdate(
                                                            content,
                                                            'contents',
                                                            'element'
                                                        ),
                                                        ...filterFieldToUpdateNestedObject(
                                                            dk_content,
                                                            'contents',
                                                            'element',
                                                            'dokkai_ask',
                                                            'dokkai'
                                                        ),
                                                    },
                                                },
                                                {
                                                    arrayFilters: [
                                                        {
                                                            'element._id':
                                                                content.content_id,
                                                        },
                                                        {
                                                            'dokkai._id':
                                                                dk_content.dokkai_id,
                                                        },
                                                    ],
                                                    new: true,
                                                }
                                            )
                                        //console.log('+++++++: 1', result)
                                    } else {
                                        result =
                                            await examsModel.findByIdAndUpdate(
                                                convert2ObjectId(exam_id),
                                                {
                                                    $push: {
                                                        'contents.$[element].dokkai_ask':
                                                            dk_content,
                                                    },
                                                },
                                                {
                                                    new: true,
                                                    arrayFilters: [
                                                        {
                                                            'element._id':
                                                                content.content_id,
                                                        },
                                                    ],
                                                }
                                            )
                                        //console.log('+++++++: 2', result)
                                    }
                                })
                            )
                        } else {
                            result = await examsModel.findByIdAndUpdate(
                                //move to repo
                                exam_id,
                                {
                                    $set: {
                                        ...filterFieldToUpdate(
                                            content,
                                            'contents',
                                            'element'
                                        ),
                                    },
                                },
                                {
                                    arrayFilters: [
                                        { 'element._id': content.content_id },
                                    ],
                                    new: true,
                                }
                            )
                            //console.log('+++++++: 3', result)
                        }
                    } else {
                        //if content_id dont have --> push to contents array
                        result = await examsModel.findByIdAndUpdate(
                            convert2ObjectId(exam_id),
                            { $push: { contents: content } },
                            { new: true }
                        )
                    }
                })
            )
        }
        return result
    }

    static delExams = async (exam_id) => {
        return deleteExams(exam_id)
    }
}

module.exports = ExamsService
