'use strict'

const wanakana = require('wanakana')
const { Types } = require('mongoose')
const _ = require('lodash')
const moment = require('moment')
//moment().format() // 2024-05-20T00:00:00+07:00(moment) === 2024-05-20T17:00:00.000+00:00(mongodb)

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
    //console.log(final)
    return final
}

const JapaneseToUnicode = (kanji) => {
    if (kanji == '' || kanji == null) {
        return
    }

    let unicodeArray = []
    for (let i = 0; i < kanji.length; i++) {
        console.log(`kanji.charCodeAt(${i})`, kanji[i])
        if (wanakana.isKanji(kanji[i])) {
            console.log('hey this is console log')
            let unicode = kanji.charCodeAt(i).toString(16)
            unicodeArray.push('0' + unicode.toLowerCase())
        }
    }
    return unicodeArray
}

const convert2ObjectId = (id) => {
    return new Types.ObjectId(id)
}

const replacePlaceholder = (template, params) => {
    Object.keys(params).forEach((key) => {
        const placeholder = `{{${key}}}`
        template = template.replace(new RegExp(placeholder, 'g'), params[key])
    })

    return template
}

//filterField update specific field
const filterFieldToUpdate = (update, field_name, name) => {
    const result = {}

    if (update.quiz) {
        result[`${field_name}.$[${name}].quiz`] = update.quiz
    }

    for (const key in update) {
        if (!Array.isArray(update[key])) {
            result[`${field_name}.$[${name}].${key}`] = update[key]
        }
    }
    return result
}

const filterFieldToUpdateNestedObject = (
    update,
    field_name,
    name,
    nested_field,
    nested_name
) => {
    const result = {}

    for (const key in update) {
        if (key == 'quiz') {
            result[
                `${field_name}.$[${name}].${nested_field}.$[${nested_name}].${key}`
            ] = update[key]
        } else {
            if (!Array.isArray(update[key])) {
                result[
                    `${field_name}.$[${name}].${nested_field}.$[${nested_name}].${key}`
                ] = update[key]
            }
        }
    }
    return result
}

/**
 *
 * @param {*} reviewDate //ngay review gan nhat
 * @param {*} interval  //so ngay tinh tu ngay review gan nhat
 * @param {*} level //cap do danh gia
 * level 0->5 tuong ung voi 5 cap do
 * level 0: (da thuoc, random)
 * level 1: (1 ngay)
 * level 2: (3 ngay)
 * level 3: (7 ngay)
 * level 4: (14 ngay)
 * level 5: (30 ngay)
 */
const nextReviewDate = (level) => {
    const levelObj = {
        0: 0,
        1: 1,
        2: 3,
        3: 7,
        4: 14,
        5: 30,
    }
    let newInterval = levelObj[level]
    const nextReviewDate = moment().startOf('day')
    nextReviewDate.day(nextReviewDate.day() + newInterval)
    const test = new Date()
    // console.log('///////', { date: nextReviewDate, interval: newInterval })
    return { date: nextReviewDate, interval: newInterval }
}

module.exports = {
    nextReviewDate,
    getInfoData,
    removeUnderfinedObjectKey,
    updateNestedObjectParser,
    JapaneseToUnicode,
    convert2ObjectId,
    replacePlaceholder,
    filterFieldToUpdate,
    filterFieldToUpdateNestedObject,
}
