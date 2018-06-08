const mongoose = require('mongoose')

module.exports = config => {
  mongoose.Promise = Promise
  mongoose.connect(config.dbUri)

  const monDb = mongoose.connection
  monDb.on('error', console.error.bind(console, 'Connection Error:'))
  monDb.once('open', () => {
    console.log(`Connected Successfully to DB: ${monDb.db.s.databaseName}`)
  })

  require('../models/User')(config)
}
