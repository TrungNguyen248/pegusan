'use strict'

const noti = require('../models/notification.model')
const { convert2ObjectId } = require('../utils')
const pushNotiToSystem = async ({
    type = 'COURSE-001',
    receivedId = 1,
    senderId = 1,
    options = {},
}) => {
    let noti_content

    if (type === 'COURSE-001') {
        noti_content = `@@@ create new course @@@@`
    } else if (type === 'EXAM-001') {
        noti_content = `@@@ create exam in  @@@@`
    }

    const newNoti = await noti.create({
        noti_type: type,
        noti_content,
        noti_senderId: convert2ObjectId(senderId),
        noti_receivedId: receivedId,
        noti_options: options,
    })

    return newNoti
}

const listNotiByUser = async ({ userId = 1, type = 'ALL', isRead = 0 }) => {
    const match = { noti_receivedId: userId }
    if (type !== 'ALL') {
        match['noti_type'] = type
    }

    return await noti.aggregate([
        {
            $match: match,
        },
        {
            $project: {
                noti_type: 1,
                noti_senderId: 1,
                noti_receivedId: 1,
                noti_content: 1,
                createdAt: 1,
                noti_options: 1,
            },
        },
    ])
}

module.exports = {
    pushNotiToSystem,
    listNotiByUser,
}
