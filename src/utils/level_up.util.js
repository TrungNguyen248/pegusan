'use strict'

const DEFAULT = {
    level: 1,
    point: 0,
    deltaNext: 100,
    cap: 100,
}

const setLevel = (point, deltaNext) => {
    return (1 + Math.sqrt(1 + (8 * point) / deltaNext)) / 2
}

const getPointToLevel = (level, deltaNext) => {
    return ((Math.pow(level, 2) - level) * deltaNext) / 2
}

const parseBypoint = function (point, cap, deltaNext) {
    point = point === undefined ? DEFAULT.point : point
    cap = cap === undefined ? DEFAULT.cap : cap
    deltaNext = deltaNext === undefined ? DEFAULT.deltaNext : deltaNext
    let l = setLevel(point, deltaNext)
    l = l > cap ? cap : l
    const level = Math.floor(l)
    let forNext = getPointToLevel(level + 1, deltaNext)
    forNext = l === cap ? Infinity : forNext
    const toNext = l === cap ? Infinity : forNext - point
    const forLast = getPointToLevel(level, deltaNext)
    return {
        level: level,
        levelFrac: l,
        point: point,
        per: (point - forLast) / (forNext - forLast),
        forNext: forNext,
        toNext: toNext,
        forLast: forLast,
    }
}

module.exports = {
    setLevel,
    getPointToLevel,
    parseBypoint,
}
