'use strict'

const { NotFoundError } = require('../core/error.response')
const progressModel = require('../models/progress.model')
const userModel = require('../models/user.model')
const { convert2ObjectId } = require('../utils')

const updateProgress = async ({ userId, ...bodyData }) => {
    const userExist = await userModel.findById(userId)
    if (!userExist) throw new NotFoundError('User not exist')

    const progressExist = await progressModel.findOne({ user: userId }).lean()
    if (!progressExist) {
        //taoj khi create account
        //hcuyen sang access
        const newProgress = await progressModel.create({
            user: userId,
            ...bodyData,
        })
        return newProgress
    } else {
        // Check have achievements
        if (bodyData.achievement_title) {
            const rs = await progressModel.findOneAndUpdate(
                {
                    user: userId,
                },
                {
                    $push: {
                        achievements: {
                            title: bodyData.achievement_title,
                            image: bodyData.achievement_image,
                        },
                    },
                },
                {
                    new: true,
                }
            )
            return rs
        }

        // Check have course
        if (bodyData.course && bodyData.course !== null) {
            let isEqual = false
            let rs = {}
            await Promise.all(
                progressExist.progress.map(async (progress) => {
                    if (
                        progress.course.toString() ===
                        bodyData.course.toString()
                    ) {
                        isEqual = true
                        rs = await progressModel.findOneAndUpdate(
                            {
                                user: userId,
                            },
                            {
                                $push: {
                                    'progress.$[element].lessons':
                                        convert2ObjectId(bodyData.lesson),
                                },
                            },
                            {
                                arrayFilters: [
                                    {
                                        'element.course': bodyData.course,
                                    },
                                ],
                                new: true,
                            }
                        )
                    }
                })
            )

            if (!isEqual) {
                rs = await progressModel.findOneAndUpdate(
                    {
                        user: userId,
                    },
                    {
                        $push: {
                            progress: {
                                course: convert2ObjectId(bodyData.course),
                                lessons: convert2ObjectId(bodyData.lesson),
                            },
                        },
                    },
                    {
                        new: true,
                    }
                )
            }
            return rs
        }

        // Check and add to examsProgress if provided
        if (bodyData.exam_id) {
            const rs = await progressModel.findOneAndUpdate(
                {
                    user: userId,
                },
                {
                    $push: {
                        examsProgress: {
                            exam: convert2ObjectId(bodyData.exam_id),
                            point: bodyData.point,
                            note: bodyData.note,
                        },
                    },
                },
                {
                    new: true,
                }
            )
            return rs
        }
    }
}

module.exports = {
    updateProgress,
}
