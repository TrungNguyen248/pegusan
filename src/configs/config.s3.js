'use strict'

const {
    s3: { aws_access_key, aws_secret_key },
} = require('./config')

const {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
} = require('@aws-sdk/client-s3')

const s3Config = {
    region: 'ap-southeast-1',
    credentials: {
        accessKeyId: aws_access_key,
        secretAccessKey: aws_secret_key,
    },
}

const s3 = new S3Client(s3Config)

module.exports = {
    s3,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
}
