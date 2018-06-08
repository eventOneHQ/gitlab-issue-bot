const express = require('express')
const passport = require('passport')

const config = require('./config')

const app = express()

// configure express
require('./config/express')(app, config)

// configure passport
require('./config/passport')(app, config)

// configure routes
require('./routes')(app, config)

app.listen(config.port, () =>
  console.log(`App listening on port ${config.port}!`)
)
