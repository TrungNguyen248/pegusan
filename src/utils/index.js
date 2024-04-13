'use strict'

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

module.exports = {
    getInfoData,
    removeUnderfinedObjectKey,
    updateNestedObjectParser,
}
