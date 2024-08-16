'use strict'

const express = require('express')
const asyncHandler = require('../../middlewares/asyncHandler')
const { authentication } = require('../../auth/authUtils')
// const { scheduleController } = require('../../controllers/schedule.controller')
const { grantAccess } = require('../../middlewares/rbac')

const {
    addFlCardToDeckCtr,
    createDeckCtr,
    updateFlCardCtr,
    getAllDeckByUserIdCtr,
    getAllFlCardByDeckCtr,
    getFlReview,
} = require('../../controllers/flashcard.controller')

const router = express.Router()
router.use(authentication)

//add lại resource của deck và flash card => thêm create:any
router.get(
    '/review',
    grantAccess('readAny', 'flashcard'),
    asyncHandler(getFlReview)
)

router.post(
    '/',
    grantAccess('updateAny', 'flashcard'),
    asyncHandler(createDeckCtr)
)
router.post(
    '/add',
    grantAccess('updateAny', 'flashcard'),
    asyncHandler(addFlCardToDeckCtr)
)
router.patch(
    '/:flcard_id',
    grantAccess('updateAny', 'flashcard'),
    asyncHandler(updateFlCardCtr)
)
router.post(
    '/all_deck',
    grantAccess('readAny', 'flashcard'),
    asyncHandler(getAllDeckByUserIdCtr)
)
router.post(
    '/all_by_deck',
    grantAccess('readAny', 'flashcard'),
    asyncHandler(getAllFlCardByDeckCtr)
)

module.exports = router
