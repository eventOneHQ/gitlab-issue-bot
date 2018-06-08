const express = require('express')

const config = require('./config')

const app = express()

// configure express
require('./config/express')(app, config)

// configure mongodb
require('./config/mongo')(config)

// configure passport
require('./config/passport')(app, config)

// configure slack
require('./config/slack')(app, config)

// configure routes
require('./routes')(app, config)

app.listen(config.port, () =>
  console.log(`App listening on port ${config.port}!`)
)
