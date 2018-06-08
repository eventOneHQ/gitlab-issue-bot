module.exports = controller => {
  // just a simple way to make sure we don't
  // connect to the RTM twice for the same team
  let _bots = {}
  const trackBot = bot => {
    _bots[bot.config.token] = bot
  }

  controller.storage.teams.all((err, teams) => {
    if (err) {
      throw new Error(err)
    }

    // connect all teams with bots up to slack!
    for (let t in teams) {
      if (teams[t].bot) {
        controller.spawn(teams[t]).startRTM((err, bot) => {
          if (err) {
            console.log('Error connecting bot to Slack:', err)
          } else {
            trackBot(bot)
          }
        })
      }
    }
  })

  require('../skills/version')(controller)
  require('../skills/issues')(controller)
}
