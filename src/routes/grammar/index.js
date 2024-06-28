'use strict'

const express = require('express')
const asyncHandler = require('../../middlewares/asyncHandler')
const GrammarController = require('../../controllers/grammar.controller')
const { authentication } = require('../../auth/authUtils')
const { grantAccess } = require('../../middlewares/rbac')

const router = express.Router()
router.use(authentication)

router.post(
    '/:level',
    grantAccess('readAny', 'grammar'),
    asyncHandler(GrammarController.getGrammarByLv)
)
router.post(
    '/all',
    grantAccess('readAny', 'grammar'),
    asyncHandler(GrammarController.getAll)
)
router.post(
    '',
    grantAccess('createAny', 'grammar'),
    asyncHandler(GrammarController.add)
)
router.patch(
    '/:id',
    grantAccess('updateAny', 'grammar'),
    asyncHandler(GrammarController.updateGrammar)
)
router.delete(
    '/:id',
    grantAccess('deleteAny', 'grammar'),
    asyncHandler(GrammarController.deleteGrammar)
)

module.exports = router
