'use strict'

const {
    getTop10,
    getRankByUserId,
    submitScoreUtils,
} = require('../utils/redis.util')

const getLeadboard = async () => {
    const leaderBoard = await getTop10()
    //console.log('LDDDDDDD::::', leaderBoard)
    const result = leaderBoard.map((rs) => ({
        username: rs.name,
        avatar: rs.avatar,
        score: rs.score,
        rank: rs.rank,
    }))
    return result
}

const rankByUserId = async (userId) => {
    const rank = await getRankByUserId(userId)
    return rank
}

const submitScoreService = async ({ user_id, score }) => {
    const result = await submitScoreUtils({ user_id, score })
    return result
}

module.exports = {
    getLeadboard,
    rankByUserId,
    submitScoreService,
}
