'use strict'

require('dotenv').config()
require('app/middleware/mongoose')

const fs = require('fs')
const crypto = require('crypto')
const path = require('path')

const AWS = require('aws-sdk')
const s3 = new AWS.S3()

const models = require('app/models')
const Upload = models.upload

const mime = require('mime')

const promisifyRandomBytes = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(16, (error, buf) => {
      if (error) {
        reject(error)
      }
      resolve(buf.toString('hex'))
    })
  })
}

const s3Upload = (params) => {
  return new Promise((resolve, reject) => {
    s3.upload(params, (error, data) => {
      if (error) {
        reject(error)
      }
      resolve(data)
    })
  })
}

const AWSUpload = (options) => {
  const mimeType = mime.lookup(options.file)
  const ext = path.extname(options.file)
  const today = new Date().toISOString().split('T')[0]
  const stream = fs.createReadStream(options.file)

  const params = {
    ACL: 'public-read',
    Body: stream,
    Bucket: process.env['AWS_S3_BUCKET_NAME'],
    ContentType: mimeType
  }

  return promisifyRandomBytes()
    .then((randomString) => {
      params.Key = `${today}/${randomString}${ext}`
      return params
    })
    .then(s3Upload)
    .then((s3Response) => {
      const upload = {
        name: options.name,
        url: s3Response.Location
      }
      return Upload.create(upload)
    })
}

module.exports = AWSUpload
