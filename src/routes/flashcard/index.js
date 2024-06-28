'use strict'

const express = require('express')
const asyncHandler = require('../../middlewares/asyncHandler')
const { authentication } = require('../../auth/authUtils')
// const { scheduleController } = require('../../controllers/schedule.controller')
const {
    addFlCardToDeckCtr,
    createDeckCtr,
    updateFlCardCtr,
    getAllDeckByUserIdCtr,
    getAllFlCardByDeckCtr,
} = require('../../controllers/flashcard.controller')

const router = express.Router()
router.use(authentication)

router.post('/', asyncHandler(createDeckCtr))
router.post('/add', asyncHandler(addFlCardToDeckCtr))
router.patch('/:flcard_id', asyncHandler(updateFlCardCtr))
router.post('/all_deck', asyncHandler(getAllDeckByUserIdCtr))
router.post('/all_by_deck', asyncHandler(getAllFlCardByDeckCtr))

module.exports = router
