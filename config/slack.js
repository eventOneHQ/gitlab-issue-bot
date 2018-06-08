const Botkit = require('botkit')

module.exports = (app, config) => {
  const controller = Botkit.slackbot({
    retry: 30,
    clientId: config.slack.clientId,
    clientSecret: config.slack.clientSecret,
    scopes: ['bot']
  })
  // console.log(controller)
  // const bot = controller.spawn()

  // bot.startRTM((err, bot, payload) => {
  //   if (err) {
  //     console.error(err)
  //     throw new Error('Could not connect to Slack')
  //   }
  // })
}
