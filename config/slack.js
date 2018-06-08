const EventApi = require('@slack/events-api')
const { WebClient } = require('@slack/client')

module.exports = (app, config) => {
  const slackEvents = EventApi.createSlackEventAdapter(
    config.slack.verificationToken
  )
  const web = new WebClient(config.slack.token)

  app.use('/slack/events', slackEvents.expressMiddleware())

  // Attach listeners to events by Slack Event "type". See: https://api.slack.com/events/message.im
  slackEvents.on('message', event => {
    // don't respond to other bots (e.g self)
    if (event.subtype === 'bot_message' || event.hidden) {
      return
    }
    console.log(event)
    web.chat
      .postMessage({ channel: event.channel, text: 'Hello there' })
      .then(res => {
        // `res` contains information about the posted message
        console.log('Message sent: ', res.ts)
      })
      .catch(console.error)
  })

  // Handle errors (see `errorCodes` export)
  slackEvents.on('error', console.error)
}
