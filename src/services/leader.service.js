'use strict'

const { getRedis } = require('../configs/config.redis')
const { NotFoundError } = require('../core/error.response')
const redisClient = getRedis()
const pointModel = require('../models/point.model')
const moment = require('moment')
const { convert2ObjectId } = require('../utils')
const { parseBypoint } = require('../utils/level_up.util')

const submitPoint = async ({ userId, name, avatar, point_sm }) => {
    const currentWeek = moment().week()
    const currentYear = moment().year()

    let userPoint = await pointModel.findOne({
        user: convert2ObjectId(userId),
    })

    if (!userPoint) {
        userPoint = await pointModel.create({
            user: userId,
            total_point: 0,
            weeklyScores: [],
        })
    }

    let weeklyScore = userPoint?.weeklyScores.find(
        (ws) => ws.week === currentWeek && ws.year === currentYear
    )
    if (!weeklyScore) {
        weeklyScore = { week: currentWeek, year: currentYear, point: point_sm }
        userPoint?.weeklyScores.push(weeklyScore)
    }

    weeklyScore.point += point_sm
    userPoint.total_point += point_sm
    await userPoint.save()

    const redisKey = `leaderboard:${currentYear}:${currentWeek}`

    await redisClient.zAdd(redisKey, {
        score: weeklyScore.point,
        value: `user:${userId}`,
    })
    await redisClient.hSet(`user:${userId}`, [
        'name',
        name,
        'avatar',
        avatar,
        'point',
        userPoint.total_point,
    ])

    return {
        ...(await redisClient.hGetAll(`user:${userId}`)),
        ...parseBypoint(userPoint.total_point), // return level detail
    }
}

//get top 10
const getRankList = async () => {
    const currentWeek = moment().week()
    const currentYear = moment().year()
    const redisKey = `leaderboard:${currentYear}:${currentWeek}`
    const ranking = await redisClient.zRangeWithScores(redisKey, 0, 9, {
        REV: true,
    })

    const topUserScore = ranking.map((r) => {
        return r.score
    })

    // List user_id
    const topUserId = ranking.map((r) => {
        return r.value
    })

    const users = []
    await Promise.all(
        topUserId.map(async (userId, index) => {
            const rs = await redisClient.hGetAll(userId)
            users.push({
                name: rs.name,
                avatar: rs.avatar,
                score: topUserScore[index],
                rank: index + 1,
            })
        })
    )
    return users
}

const getRankByUserId = async (userId) => {
    const currentWeek = moment().week()
    const currentYear = moment().year()
    const redisKey = `leaderboard:${currentYear}:${currentWeek}`
    const rank = await redisClient.zRevRank(redisKey, `user:${userId}`, {
        WITHSCORE: true,
    })
    //console.log(rank)
    if (rank == null) throw new NotFoundError('User not found')
    return rank + 1
}

module.exports = {
    submitPoint,
    getRankList,
    getRankByUserId,
}
