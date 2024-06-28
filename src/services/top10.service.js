'use strict'

const moment = require('moment')
const top10Model = require('../models/top10.model')
const { NotFoundError } = require('../core/error.response')
const { getRedis } = require('../configs/config.redis')
const redisClient = getRedis()

const getTop10PreviousWeek = async () => {
    const previousWeek = moment().subtract(1, 'weeks').week()
    const currentYear = moment().year()
    const redisKey = `leaderboard:${currentYear}:${previousWeek}`

    const rs = await redisClient.zRangeWithScores(redisKey, 0, 9, {
        REV: true,
    })

    const topUserScore = rs.map((r) => {
        return r.score
    })

    // List user_id
    const topUserId = rs.map((r) => {
        return r.value
    })

    // name:  String
    // avatar:  String
    // point:  Number
    // rank: Number
    const users = []
    await Promise.all(
        topUserId.map(async (userId, index) => {
            const result = await redisClient.hGetAll(userId)
            users.push({
                name: result.name,
                avatar: result.avatar,
                point: topUserScore[index],
                rank: index + 1,
            })
        })
    )

    await top10Model.create({
        week: previousWeek,
        year: currentYear,
        top10: users,
    })

    redisClient.del(redisKey, (err, response) => {
        if (err) {
            console.error('Failed to reset leaderboard:', err)
        } else {
            console.log('Leaderboard reset successfully')
        }
    })
}

module.exports = {
    getTop10PreviousWeek,
}
