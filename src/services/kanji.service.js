'use strict'

const { getSignedUrl } = require('@aws-sdk/cloudfront-signer')
const {
    getAllKanji,
    getAllKanjiByLevel,
    getKanji,
    addKanji,
} = require('../models/repos/kanji.repo')
const { NotFoundError } = require('../core/error.response')
const axios = require('axios')

const cloudFrontUrl = process.env.CLOUD_FRONT_URL
const folderPath = 'colorized-kanji-stroke'

const getSvgContent = async ({ kanji }) => {
    const res = await axios.get(`${cloudFrontUrl}/${folderPath}/${kanji}.svg`)

    return res.data
}

const getAllKanjiService = async (level) => {
    const result = await getAllKanji(level.toUpperCase())
    if (result.length <= 0)
        throw new NotFoundError(`Not found any kanji ${level} `)
    return result
}

const allKanjiByLevel = async (level, page) => {
    const result = await getAllKanjiByLevel(level.toUpperCase(), page)
    if (result.length <= 0)
        throw new NotFoundError(`Not found any kanji ${level} `)
    return result
}

const addKanjiService = async (bodyData) => {
    const newKanji = await addKanji(bodyData)
    return newKanji
}

const kanjiByName = async ({ word }) => {
    const result = await getKanji(word)
    if (!result) throw new NotFoundError('Kanji not found')
    // result.svg_path = getSignedUrl({
    //     url: `${cloudFrontUrl}/${result.svg_path}`,
    //     keyPairId: process.env.KEY_PAIR_ID,
    //     dateLessThan: new Date(Date.now() + 1000 * 3600 * 48), // het han trong 2 ngay
    //     privateKey: process.env.AWS_BUCKET_PRIVATE_KEY_ID,
    // })
    return result
}

module.exports = {
    getAllKanjiService,
    allKanjiByLevel,
    kanjiByName,
    addKanjiService,
    getSvgContent,
}
