'use strict'

const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const GrammarController = require('../../controllers/grammar.controller')
const { authentication } = require('../../auth/authUtils')

const router = express.Router()
router.use(authentication)

router.post('/add/:lesson_id', asyncHandler(GrammarController.add))
router.post(
    '/update/:lesson_id/:id',
    asyncHandler(GrammarController.updateGrammar)
)
router.post(
    '/delete/:lesson_id/:id',
    asyncHandler(GrammarController.deleteGrammar)
)

module.exports = router
