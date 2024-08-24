'use strict'

const express = require('express')
const asyncHandler = require('../../middlewares/asyncHandler')
const uploadController = require('../../controllers/upload.controller')
const { uploadDisk, uploadMemory } = require('../../configs/config.multer')
const { authentication } = require('../../auth/authUtils')

const router = express.Router()
router.use(authentication)
router.post('/lesson', asyncHandler(uploadController.uploadFile))
router.post(
    '/lesson/thumb',
    uploadDisk.single('file'),
    asyncHandler(uploadController.uploadFileThumb)
)

//upload s3
router.post(
    '/lesson/bucket',
    uploadMemory.single('file'),
    asyncHandler(uploadController.uploadImageFromLocalS3)
)

router.post(
    '/avatar',
    uploadMemory.single('file'),
    asyncHandler(uploadController.uploadUserImageCtr)
)

module.exports = router
