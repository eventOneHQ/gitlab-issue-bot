const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = config => {
  const userSchema = new Schema({
    gitlabInstanceAddress: {
      type: String,
      default: 'https://gitlab.com'
    },
    gitlabAccessToken: String,
    slackId: {
      type: String,
      required: false,
      unique: true
    },
    created_at: {
      type: Date,
      required: true,
      default: Date.now
    },
    updated_at: {
      type: Date,
      required: true,
      default: Date.now
    }
  })

  userSchema.pre('save', function (next) {
    this.updated_at = Date.now
    next()
  })

  const userModel = mongoose.model('User', userSchema)
  return userModel
}
