const Botkit = require('botkit')

const config = require('./config')

const mongodbStorage = require('botkit-storage-mongo')({
  mongoUri: config.dbUri
})

const controller = Botkit.slackbot({
  storage: mongodbStorage,
  retry: 30,
  port: config.port,
  clientId: config.slack.clientId,
  clientSecret: config.slack.clientSecret,
  scopes: ['bot']
})

controller.startTicking()

// configure express
const app = require('./config/express')(controller, config)

require('./routes')(app, controller)

// configure rtm sockets
require('./config/rtm')(controller)

require('./config/user_registration.js')(controller)
