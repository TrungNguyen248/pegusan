'use strict'

const express = require('express')
const asyncHandler = require('../../middlewares/asyncHandler')
const { authentication } = require('../../auth/authUtils')
const { grantAccess } = require('../../middlewares/rbac')
const {
    getAllKanji,
    getAllKanjiByLevel,
    getKanji,
    addKanji,
    getSvgContentCtr,
} = require('../../controllers/kanji.controller')

const router = express.Router()
router.use(authentication)

router.post('/svg', asyncHandler(getSvgContentCtr))
router.post('/add', grantAccess('createAny', 'kanji'), asyncHandler(addKanji))
router.post(
    '/:jlpt/:page',
    grantAccess('readAny', 'kanji'),
    asyncHandler(getAllKanjiByLevel)
)
router.post(
    '/:level',
    grantAccess('readAny', 'kanji'),
    asyncHandler(getAllKanji)
)
router.get('/', grantAccess('readAny', 'kanji'), asyncHandler(getKanji)) //?word=?
//delete
//grantAccess('deleteAny', 'kanji')
module.exports = router
