const { SuccessResponse } = require('../core/success.response')
const {
    getLeadboard,
    rankByUserId,
    submitScoreService,
} = require('../services/leaderboard.service')

const getTop10 = async (req, res, next) => {
    new SuccessResponse({
        message: 'Top 10',
        metadata: await getLeadboard(),
    }).send(res)
}

const getRankOne = async (req, res, next) => {
    new SuccessResponse({
        message: 'Get rank by userId',
        metadata: await rankByUserId(req.params.id),
    }).send(res)
}

const submitScore = async (req, res, next) => {
    new SuccessResponse({
        message: 'Submit score success',
        metadata: await submitScoreService(req.body),
    }).send(res)
}

module.exports = {
    getTop10,
    getRankOne,
    submitScore,
}
