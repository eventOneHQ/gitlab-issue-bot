const sea = require('@slack/events-api')

module.exports = (app, config) => {
  const slackEvents = sea.createSlackEventAdapter(
    config.slack.verificationToken
  )

  app.use('/slack/events', slackEvents.expressMiddleware())

  // Attach listeners to events by Slack Event "type". See: https://api.slack.com/events/message.im
  slackEvents.on('message', event => {
    console.log(
      `Received a message event: user ${event.user} in channel ${
        event.channel
      } says ${event.text}`
    )
  })

  // Handle errors (see `errorCodes` export)
  slackEvents.on('error', console.error)
}
