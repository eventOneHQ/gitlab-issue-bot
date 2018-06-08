const passport = require('passport')
const GitLabStrategy = require('passport-gitlab2')

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
      (accessToken, refreshToken, profile, done) => {
        return done(null, profile)
        // User.findOrCreate({ gitlabId: profile.id }, (err, user) => {
        //   return done(err, user);
        // });
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
