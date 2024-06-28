'use strict'

const express = require('express')
const asyncHandler = require('../../middlewares/asyncHandler')
const { authentication } = require('../../auth/authUtils')
const {
    getTop10,
    getRankOne,
    submitScore,
} = require('../../controllers/leaderboard.controller')

const router = express.Router()
//router.use(authentication)

router.get('/top10', asyncHandler(getTop10))
router.get('/:id', asyncHandler(getRankOne))
router.post('/submit', asyncHandler(submitScore))

module.exports = router
