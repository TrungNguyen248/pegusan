'use strict'

const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const vocabularyController = require('../../controllers/vocabulary.controller')
const { authentication } = require('../../auth/authUtils')

const router = express.Router()
router.use(authentication)

router.post('/add/:lesson_id', asyncHandler(vocabularyController.add))
router.post('/all/:lesson_id', asyncHandler(vocabularyController.getAll))
router.post(
    '/update/:lesson_id/:id',
    asyncHandler(vocabularyController.updateVocab)
)
router.post(
    '/delete/:lesson_id/:id',
    asyncHandler(vocabularyController.deleteVocab)
)

module.exports = router
