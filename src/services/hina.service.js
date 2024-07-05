'use strict'

const { findById } = require('../models/repos/course.repo')
const { findHinaByLessonId, createHina } = require('../models/repos/hina.repo')
const { NotFoundError } = require('../core/error.response')
const { getSignedUrl } = require('@aws-sdk/cloudfront-signer')
const { convert2ObjectId } = require('../utils')
const progressModel = require('../models/progress.model')

const cloudFrontUrl = process.env.CLOUD_FRONT_URL

const getHinaByLesson = async ({ userId, lesson_id, course_id }) => {
    let result = await findHinaByLessonId(lesson_id)
    if (!result) throw new NotFoundError(`Not found any word ${result}`)
    console.log('lessonInfo:::::::::::', result)
    const userProgression = await progressModel.findOne({
        user: convert2ObjectId(userId),
    })
    const listRegistered = userProgression.progress
    listRegistered.forEach((el, idx) => {
        if (el.course.toString() === course_id) {
            const r = listRegistered[idx].lessons
            for (let i = 0; i < r.length; i++) {
                if (r[i].toString() === result._id.toString()) {
                    console.log('TRue:::::::::::', r[i].toString())
                    result = {
                        ...result,
                        learnt: true,
                    }
                    console.log('result:::::::::::', result)
                }
            }
        }
    })

    //sign url with cloudfront
    // result.svg_path.forEach((svg, i) => {
    //     result.svg_path[i] = getSignedUrl({
    //         url: `${cloudFrontUrl}/${svg}`,
    //         keyPairId: process.env.KEY_PAIR_ID,
    //         dateLessThan: new Date(Date.now() + 1000 * 3600 * 48), // expired in 2 days
    //         privateKey: process.env.AWS_BUCKET_PRIVATE_KEY_ID,
    //     })
    // })
    // result.words.forEach((item) => {
    //     item.audio = getSignedUrl({
    //         url: `${cloudFrontUrl}/${item.audio}`,
    //         keyPairId: process.env.KEY_PAIR_ID,
    //         dateLessThan: new Date(Date.now() + 1000 * 3600 * 48), // expired in 2 days
    //         privateKey: process.env.AWS_BUCKET_PRIVATE_KEY_ID,
    //     })
    // })

    return result
}

const addHinaLesson = async ({ course_id, ...bodyData }) => {
    const foundCourse = await findById(convert2ObjectId(course_id))
    if (!foundCourse) throw new NotFoundError(`Course not found`)

    const result = await createHina(course_id, bodyData)
    return result
}

module.exports = {
    getHinaByLesson,
    addHinaLesson,
}
