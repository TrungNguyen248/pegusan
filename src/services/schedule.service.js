'use strict'

const scheduleModel = require('../models/schedule.model')

const updateSchedule = async (userId, { wordId, sch_id = null, level }) => {
    let result = {}
    const { date, interval } = nextReviewDate(level)

    //console.log("word", word);
    if (sch_id !== null) {
        result = await scheduleModel
            .findOneAndUpdate(
                {
                    userId,
                },
                {
                    $set: {
                        'words.$[element].reviewDate': date,
                        'words.$[element].interval': interval,
                    },
                },
                {
                    new: true,
                    arrayFilters: [{ 'element._id': sch_id }],
                }
            )
            .populate({
                path: 'words',
                populate: {
                    path: 'word',
                },
            })
    } else {
        const schedule_data = {
            word: wordId,
            reviewDate: date,
            interval: interval,
        }
        //console.log(schedule_data);

        schedule.words.push(schedule_data)
        await schedule.save()
        result = await scheduleModel.findOne({ userId }).populate({
            path: 'words',
            populate: {
                path: 'word',
            },
        })
    }

    //console.log(result)
    return result
}

const createSchedule = async (userId, data) => {
    const { wordId, level, tags } = data
    const { date, interval } = nextReviewDate(level)
    const word = {}

    word.tags = tags
    word.word = wordId
    word.reviewDate = date
    word.interval = interval

    const newSchedule = await scheduleModel.create({
        userId,
        words: [word],
    })
    return newSchedule
}

const scheduleSerivce = async (bodyData) => {
    const { userId, ...data } = bodyData
    const schedule = await scheduleModel.findOne({
        userId,
    })
    if (schedule) {
        return updateSchedule(userId, data)
    } else {
        return createSchedule(userId, data)
    }
}

module.exports = {
    scheduleSerivce,
}
