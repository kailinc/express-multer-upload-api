'use strict'

const AWSUpload = require('../lib/s3-uploads')

const file = process.argv[2]
const name = process.argv[3]

AWSUpload({ file, name })
  .then(console.log)
  .catch(console.error)
