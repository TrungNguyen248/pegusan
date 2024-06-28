'use strict'

'use strict'

const express = require('express')
const asyncHandler = require('../../middlewares/asyncHandler')
const renshuuController = require('../../controllers/renshuu.controller')
const { authentication } = require('../../auth/authUtils')
const { grantAccess } = require('../../middlewares/rbac')

const router = express.Router()
router.use(authentication)

//get all renshuu
//grantAccess('readAny', 'renshuu'),

router.post(
    '',
    grantAccess('createAny', 'renshuu'),
    asyncHandler(renshuuController.createRenshuu)
)
router.patch(
    '/:id',
    grantAccess('updateAny', 'renshuu'),
    asyncHandler(renshuuController.updateRenshuu)
)
router.delete(
    '/:id',
    grantAccess('deleteAny', 'renshuu'),
    asyncHandler(renshuuController.deleteRenshuu)
)

module.exports = router
