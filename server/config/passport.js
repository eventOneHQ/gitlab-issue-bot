const passport = require('passport')
const GitLabStrategy = require('passport-gitlab2')
const mongoose = require('mongoose')

const User = mongoose.model('User')
module.exports = (app, config) => {
  app.use(passport.initialize()) // Used to initialize passport
  app.use(passport.session()) // Used to persist login sessions

  passport.use(
    new GitLabStrategy(
      {
        clientID: config.gitlabAppId,
        clientSecret: config.gitlabAppSecret,
        callbackURL: `${config.baseUrl}/auth/gitlab/callback`
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user

          // find the user
          user = await User.findOne({ gitlabId: profile.id }).exec()

          // if it doesn't exist, create it
          if (!user) {
            user = new User({ gitlabId: profile.id })
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
