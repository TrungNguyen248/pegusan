'use strict'

const { findById } = require('../models/repos/course.repo')
const { findHinaByLessonId, createHina } = require('../models/repos/hina.repo')
const { NotFoundError } = require('../core/error.response')
const { getSignedUrl } = require('@aws-sdk/cloudfront-signer')
const { convert2ObjectId } = require('../utils')

const cloudFrontUrl = process.env.CLOUD_FRONT_URL

const getHinaByLesson = async ({ lesson_id }) => {
    const result = await findHinaByLessonId(lesson_id)
    if (!result) throw new NotFoundError(`Not found any word ${result}`)

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
