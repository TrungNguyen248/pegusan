'use strict'

const { BadRequestError } = require('../core/error.response')
const { SuccessResponse } = require('../core/success.response')
const {
    uploadImageFromUrl,
    uploadImageFromLocal,
    uploadImageFromLocalS3,
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
    uploadImageFromLocalS3 = async (req, res, next) => {
        const { file } = req
        if (!file) {
            throw new BadRequestError('File missing')
        }
        new SuccessResponse({
            message: 'Upload successing upload use S3',
            metadata: await uploadImageFromLocalS3({
                file,
            }),
        }).send(res)
    }
}

module.exports = new UploadController()
