'use strict'

const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const vocabularyController = require('../../controllers/vocabulary.controller')
const { authentication } = require('../../auth/authUtils')

const router = express.Router()
router.use(authentication)

router.post('', asyncHandler(vocabularyController.add))
router.post('/all/:lesson_id', asyncHandler(vocabularyController.getAll))
router.patch('/:id', asyncHandler(vocabularyController.updateVocab))
router.delete('/:id', asyncHandler(vocabularyController.deleteVocab))

module.exports = router
