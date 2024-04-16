'use strict'

const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const GrammarController = require('../../controllers/grammar.controller')
const { authentication } = require('../../auth/authUtils')

const router = express.Router()
router.use(authentication)

router.post('', asyncHandler(GrammarController.add))
router.patch('/:id', asyncHandler(GrammarController.updateGrammar))
router.delete('/:id', asyncHandler(GrammarController.deleteGrammar))

module.exports = router
