const EventApi = require('@slack/events-api')
const { WebClient } = require('@slack/client')

module.exports = (app, config) => {
  const slackEvents = EventApi.createSlackEventAdapter(
    config.slack.verificationToken
  )
  const web = new WebClient(config.slack.token)
  web.chat
    .postMessage({ channel: 'C542VDK62', text: 'Starting up...' })
    .then(res => {
      // `res` contains information about the posted message
      console.log('Message sent: ', res.ts)
    })
    .catch(console.error)

  app.use('/slack/events', slackEvents.expressMiddleware())

  // Attach listeners to events by Slack Event "type". See: https://api.slack.com/events/message.im
  slackEvents.on('message', event => {
    console.log(event)
  })

  // Handle errors (see `errorCodes` export)
  slackEvents.on('error', console.error)
}
