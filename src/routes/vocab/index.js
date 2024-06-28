'use strict'

const express = require('express')
const asyncHandler = require('../../middlewares/asyncHandler')
const vocabularyController = require('../../controllers/vocabulary.controller')
const { authentication } = require('../../auth/authUtils')
const { grantAccess } = require('../../middlewares/rbac')

const router = express.Router()
router.use(authentication)

router.post(
    '',
    grantAccess('createAny', 'vocab'),
    asyncHandler(vocabularyController.add)
)
router.post(
    '/all/:lesson_id',
    grantAccess('readAny', 'vocab'),
    asyncHandler(vocabularyController.getAll)
)
router.patch(
    '/:id',
    grantAccess('updateAny', 'vocab'),
    asyncHandler(vocabularyController.updateVocab)
)
router.delete(
    '/:id',
    grantAccess('deleteAny', 'vocab'),
    asyncHandler(vocabularyController.deleteVocab)
)

module.exports = router
