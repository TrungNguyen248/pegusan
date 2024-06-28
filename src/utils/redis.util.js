const { getRedis } = require('../configs/config.redis')
const { NotFoundError } = require('../core/error.response')
const redisClient = getRedis()

const leaderBoardKey = 'leaderboard_set'

const createUserRedis = async ({ user_id, user_name, avatar }) => {
    await redisClient.hSet(
        `user:${user_id}`,
        'name',
        user_name,
        'avatar',
        avatar
    )
    await redisClient.zAdd(leaderBoardKey, {
        score: 0,
        value: `user:${user_id}`,
    })
    return
}

const updateUserHash = async (avatar) => {
    await redisClient.hSet(`user:${user_id}`, 'avatar', avatar)
}

const submitScoreUtils = async ({ user_id, score }) => {
    const score_ = await redisClient.zScore(leaderBoardKey, `user:${user_id}`)
    let player_score = parseInt(score_, 10)
    player_score += score
    console.log(player_score)
    if (score_ == null) throw new NotFoundError('Not found player')
    await redisClient.zAdd(leaderBoardKey, {
        score: player_score,
        value: `user:${user_id}`,
    })
    return player_score
}

const getTop10 = async (limit = 9) => {
    const ranking = await redisClient.zRangeWithScores(
        leaderBoardKey,
        0,
        limit,
        {
            REV: true,
        }
    )
    //List score
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
    const rank = await redisClient.zRevRank(leaderBoardKey, userId, {
        WITHSCORE: true,
    })
    //console.log(rank)
    if (rank == null) throw new NotFoundError('User not found')
    return rank
}

module.exports = {
    getTop10,
    getRankByUserId,
    createUserRedis,
    submitScoreUtils,
    //
    updateUserHash,
}
