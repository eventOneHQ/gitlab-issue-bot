const passport = require('passport')
const SlackStrategy = require('passport-slack-oauth2').Strategy
const mongoose = require('mongoose')

const User = mongoose.model('User')
module.exports = (app, config) => {
  app.use(passport.initialize()) // Used to initialize passport
  app.use(passport.session()) // Used to persist login sessions

  passport.use(
    new SlackStrategy(
      {
        clientID: config.slack.clientId,
        clientSecret: config.slack.clientSecret,
        callbackURL: `${config.baseUrl}/auth/slack/callback`
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user

          // find the user
          user = await User.findOne({ slackId: profile.id }).exec()

          // if it doesn't exist, create it
          if (!user) {
            user = new User({ slackId: profile.id })
            await user.save()
          }

          return done(null, user)
        } catch (err) {
          throw new Error(err)
        }
      }
    )
  )

  // Used to stuff a piece of information into a cookie
  passport.serializeUser((user, done) => {
    done(null, user)
  })

  // Used to decode the received cookie and persist session
  passport.deserializeUser((user, done) => {
    done(null, user)
  })
}
