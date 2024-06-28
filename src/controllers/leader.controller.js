const { SuccessResponse } = require('../core/success.response')
const {
    submitPoint,
    getRankList,
    getRankByUserId,
} = require('../services/leader.service')
//const { getTop10PreviousWeek } = require('../services/top10.service')

// const test = async (req, res, next) => {
//     new SuccessResponse({
//         message: 'sucessfully',
//         metadata: await getTop10PreviousWeek(),
//     }).send(res)
// }

const submitPointCtr = async (req, res, next) => {
    new SuccessResponse({
        message: 'add successfully',
        metadata: await submitPoint(req.body),
    }).send(res)
}

const getRankListCtr = async (req, res, next) => {
    new SuccessResponse({
        message: 'get rank list successfully',
        metadata: await getRankList(),
    }).send(res)
}

const getRankByUserIdCtr = async (req, res, next) => {
    new SuccessResponse({
        message: 'get rank by userid successfully',
        metadata: await getRankByUserId(req.params.user_id),
    }).send(res)
}

module.exports = {
    submitPointCtr,
    getRankListCtr,
    getRankByUserIdCtr,
}
