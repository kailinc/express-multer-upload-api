'use strict'

require('dotenv').config()

const AWS = require('aws-sdk')
// requires the aws-sdk from amazon

const fs = require('fs')
// don't have to npm install cuz part of node module

const crypto = require('crypto')
// get crypto module from node

const mime = require('mime')
// npm package to let you look at img

const path = require('path')
// gets path module from node npm

const s3 = new AWS.S3()
// use AWS by this

const file = process.argv[2]
// file to upload

const name = process.argv[3]
// name of file you upload

const mimeType = mime.lookup(file)
// sees the type of file

let key = 'default'
// name of file in aws S3 Bucket

const ext = path.extname(file)

const stream = fs.createReadStream(file)

const promisifyRandomBytes = () => {
  // randombytes in promise form
  return new Promise((resolve, reject) => {
    crypto.randomBytes(16, (err, buf) => {
      // gives you a random string of 16 using crypto
      if (err) {
        reject(err)
      }
      resolve(buf.toString('hex'))
    })
  })
}

// const params = {
//   // params for uploading files in amazon
//   ACL: 'public-read',
//   Body: stream,
//   Bucket: 'airkicks',
//   Key: key
//   // name of the file stored as
// }

const s3upload = (params) => {
  // promisfied version of s3upload
  return new Promise((resolve, reject) => {
    s3.upload(params, function (err, data) {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}
const today = new Date().toISOString().split('T')[0] + '/'

promisifyRandomBytes()
  .then((ranString) => {
    return {
      ACL: 'public-read',
      Body: stream,
      Bucket: 'airkicks',
      Key: today + ranString + ext,
      ContentType: mimeType
    }
  })
  .then(s3upload)
  .then(console.log)
  .catch((error) => console.error(error.stack))
