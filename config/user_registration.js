module.exports = controller => {
  /* Handle event caused by a user logging in with oauth */
  controller.on('oauth:success', payload => {
    if (!payload.identity.team_id) {
      console.log(
        'Error: received an oauth response without a team id',
        payload
      )
    }
    controller.storage.teams.get(payload.identity.team_id, (err, team) => {
      if (err) {
        console.log(
          'Error: could not load team from storage system:',
          payload.identity.team_id,
          err
        )
      }

      let newTeam = false
      if (!team) {
        team = {
          id: payload.identity.team_id,
          createdBy: payload.identity.user_id,
          url: payload.identity.url,
          name: payload.identity.team
        }
        newTeam = true
      }

      team.bot = {
        token: payload.bot.bot_access_token,
        user_id: payload.bot.bot_user_id,
        createdBy: payload.identity.user_id,
        app_token: payload.access_token
      }

      const testbot = controller.spawn(team.bot)

      testbot.api.auth.test({}, (err, botAuth) => {
        if (err) {
          console.log('Error: could not authenticate bot user', err)
        } else {
          team.bot.name = botAuth.user

          // add in info that is expected by Botkit
          testbot.identity = botAuth
          testbot.team_info = team

          // Replace this with your own database!

          controller.storage.teams.save(team, (err, id) => {
            if (err) {
              console.log('Error: could not save team record:', err)
            } else {
              if (newTeam) {
                controller.trigger('create_team', [testbot, team])
              } else {
                controller.trigger('update_team', [testbot, team])
              }
            }
          })
        }
      })
    })
  })

  controller.on('create_team', (bot, team) => {
    console.log('Team created:', team.name)

    // Trigger an event that will cause this team to receive onboarding messages
    controller.trigger('onboard', [bot, team])
  })

  controller.on('update_team', (bot, team) => {
    console.log('Team updated:', team.name)
  })

  controller.on('onboard', bot => {
    console.log('Starting an onboarding experience!')

    bot.startPrivateConversation(
      { user: bot.config.createdBy },
      (err, convo) => {
        if (err) {
          console.log(err)
        } else {
          convo.say('I am a bot that has just joined your workspace')
          convo.say(
            'You must now /invite me to a channel so that I can be of use!'
          )
        }
      }
    )
  })
}
