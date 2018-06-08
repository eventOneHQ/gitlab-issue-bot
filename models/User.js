const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = config => {
  const userSchema = new Schema({
    gitlabId: {
      type: String,
      required: true,
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
