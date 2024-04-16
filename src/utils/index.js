'use strict'

const { Types } = require('mongoose')
const _ = require('lodash')

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields)
}

const removeUnderfinedObjectKey = (obj) => {
    Object.keys(obj).forEach((key) => {
        if (obj[key] == null) delete obj[key]
    })

    return obj
}

const updateNestedObjectParser = (obj) => {
    const final = {}
    Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === 'Object' && !Array.isArray(obj[key])) {
            const res = updateNestedObjectParser(obj[key])
            Object.keys(res).forEach((a) => {
                final[`${key}.${a}`] = res[a]
            })
        } else {
            final[key] = obj[key]
        }
    })

    return final
}

const kanjiToUnicode = (kanji) => {
    if (kanji == '' || kanji == null) {
        return
    }
    let unicodeArray = []
    for (let i = 0; i < kanji.length; i++) {
        let unicode = kanji.charCodeAt(i).toString(16)
        unicodeArray.push('0' + unicode.toLowerCase())
    }
    return unicodeArray
}

const convert2ObjectId = (id) => {
    return new Types.ObjectId(id)
}

module.exports = {
    getInfoData,
    removeUnderfinedObjectKey,
    updateNestedObjectParser,
    kanjiToUnicode,
    convert2ObjectId,
}
