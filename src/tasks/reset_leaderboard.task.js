'use strict'

const cron = require('node-cron')
const { getTop10PreviousWeek } = require('../services/top10.service')

cron.schedule('0 0 * * 0', async () => {
    await getTop10PreviousWeek()
})
