'use strict'

const mongoose = require('mongoose')

const uploadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

const Upload = mongoose.model('Upload', uploadSchema)

module.exports = Upload
