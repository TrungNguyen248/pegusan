'use strict'

const { BadRequestError } = require('../core/error.response')
const { SuccessResponse } = require('../core/success.response')
const {
    uploadImageFromUrl,
    uploadImageFromLocal,
    uploadUserImage,
} = require('../services/upload.service')

class UploadController {
    uploadFile = async (req, res, next) => {
        new SuccessResponse({
            message: 'Upload successfully',
            metadata: await uploadImageFromUrl(),
        }).send(res)
    }
    uploadFileThumb = async (req, res, next) => {
        const { file } = req
        if (!file) throw new BadRequestError('Not found file')
        new SuccessResponse({
            message: 'Upload thumb successfully',
            metadata: await uploadImageFromLocal({
                path: file.path,
            }),
        }).send(res)
    }

    //use s3
    uploadUserImageCtr = async (req, res, next) => {
        const { file } = req
        if (!file) {
            throw new BadRequestError('File missing')
        }
        new SuccessResponse({
            message: 'Upload successing upload use S3',
            metadata: await uploadUserImage({
                user_id: req.user.userId,
                file,
            }),
        }).send(res)
    }
}

module.exports = new UploadController()
