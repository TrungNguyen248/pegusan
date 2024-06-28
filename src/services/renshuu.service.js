'use strict'

const { BadRequestError, NotFoundError } = require('../core/error.response')
const renshuuModel = require('../models/renshuu.model')
const {
    findRenshuuByTitle,
    createRenshuu,
    findRenshuuById,
    updateRenshuu,
    deleteRenshuu,
} = require('../models/repos/renshuu.repo')
const {
    removeUnderfinedObjectKey,
    convert2ObjectId,
    filterFieldToUpdate,
    updateNestedObjectParser,
} = require('../utils')

class RenshuuService {
    static createRenshuu = async ({ lesson_id, ...bodyData }) => {
        const title = bodyData?.title
        const renshuuTitleExists = await findRenshuuByTitle({ title })

        if (renshuuTitleExists)
            throw new BadRequestError('Title already exists')

        return await createRenshuu({ ...bodyData })
    }

    static updateRenshuuCase = async (renshuu_id, bodyUpdate) => {
        let result = {}
        const renshuuExist = await findRenshuuById({ renshuu_id })

        if (!renshuuExist) throw new NotFoundError('Renshuu not found')
        const { contents, ...updateData } = bodyUpdate
        const idToRemoves = updateData?.delete_arr
        if (idToRemoves && idToRemoves.length != 0) {
            await renshuuModel.updateOne(
                //remove to repo
                { _id: renshuu_id },
                {
                    $pull: {
                        contents: {
                            _id: { $in: idToRemoves }, // $in: []
                        },
                    },
                }
            )
        }

        if (updateData && updateData.length != 0) {
            const uddt = removeUnderfinedObjectKey(updateData)
            result = await renshuuModel.findByIdAndUpdate(
                renshuu_id,
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
                        console.log(':::1')
                        result = await renshuuModel.findByIdAndUpdate(
                            //move to repo
                            renshuu_id,
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
                    } else {
                        result = await renshuuModel.findOneAndUpdate(
                            { _id: convert2ObjectId(renshuu_id) },
                            {
                                $push: { contents: content },
                            },
                            { new: true }
                        )
                    }
                })
            )
            return result
        } else {
            console.log(':::3')
            return await updateRenshuu(
                renshuu_id,
                removeUnderfinedObjectKey(updateData)
            )
        }
    }

    static delRenshuu = async (renshuu_id) => {
        return await deleteRenshuu(renshuu_id)
    }
}

module.exports = RenshuuService

// {
// "title": "Renshuu 1",
// "contents": [
//     {
//         "_id":"662a8b46fec21f144b4f2c21",
//         "content_text": "Cau 1",
//         "point": 30,
//         "url_audio": "https://cau1.commm",
//         "value": "B",
//         "quiz": ["A", "B", "C", "D"]
//     },
//     {
//         "_id":"662a8b46fec213144b4f2c21",
//         "content_text": "Cau 2",
//         "point": 30,
//         "url_audio": "https://cau2.comm",
//         "value": "C",
//         "quiz": ["A", "B", "C", "D"]
//     }
// ]
// }
