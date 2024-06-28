'use strict'

const { s3, PutObjectCommand } = require('../configs/config.s3')
//const { getSignedUrl } = require('@aws-sdk/s3-request-presigner') //s3
const { getSignedUrl } = require('@aws-sdk/cloudfront-signer') // cloudfront
const crypto = require('crypto')

const urlImagePublic = 'https://d28at3pxt9wnoo.cloudfront.net'

const randomImageName = () => crypto.randomBytes(16).toString('hex')

//upload from image local (S3)
const uploadImageFromLocalS3 = async ({ file }) => {
    try {
        const imageName = randomImageName()
        const folderName = 'users'
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${folderName}/${imageName}`,
            Body: file.buffer,
            ContentType: 'image/jpeg',
        })

        const result = await s3.send(command)
        console.log(result)

        //export url s3
        // const singleUrl = new GetObjectCommand({
        //     Bucket: process.env.AWS_BUCKET_NAME,
        //     Key: imageName,
        // })

        // const signedUrl = getSignedUrl({
        //     url: `${urlImagePublic}/${folderName}/${imageName}`,
        //     keyPairId: 'K2ET73F7B906GC',
        //     dateLessThan: new Date(Date.now() + 1000 * 60), // expired in 60 seconds
        //     privateKey: process.env.AWS_BUCKET_PRIVATE_KEY_ID,
        // })

        return {
            url: `${urlImagePublic}/${folderName}/${imageName}`,
            result,
        }
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    uploadImageFromLocalS3,
}
