'use strict'

'use strict'

const express = require('express')
const asyncHandler = require('../../middlewares/asyncHandler')
const { authentication } = require('../../auth/authUtils')
const examsController = require('../../controllers/exams.controller')
const { grantAccess } = require('../../middlewares/rbac')

const router = express.Router()
router.use(authentication)

router.get(
    '/:tags/:level',
    grantAccess('readAny', 'exams'),
    asyncHandler(examsController.getExamsByTagCtr)
)
router.post(
    '/:id',
    grantAccess('readAny', 'exams'),
    asyncHandler(examsController.getExamsByIdCtr)
)
router.post(
    '',
    grantAccess('createAny', 'exams'),
    asyncHandler(examsController.createExams)
)
router.patch(
    '/:id',
    grantAccess('updateAny', 'exams'),
    asyncHandler(examsController.updateExams)
)
router.delete(
    '/:id',
    grantAccess('deleteAny', 'exams'),
    asyncHandler(examsController.deleleExams)
)

module.exports = router
