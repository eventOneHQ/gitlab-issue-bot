const mongoose = require('mongoose')

module.exports = (app, config) => {
  const User = mongoose.model('User')
  // Middleware to check if the user is authenticated
  const isUserAuthenticated = (req, res, next) => {
    if (req.user) {
      next()
    } else {
      res.redirect('/auth/login')
    }
  }

  app.use('/auth', require('./auth.js')(config))

  // config route
  app.get('/config', isUserAuthenticated, async (req, res) => {
    try {
      const user = await User.findOne({ slackId: req.user.slackId }).exec()
  
      res.render('config', { isConfig: true, user })
    } catch (err) {
      throw new Error(err)
    }
  })

  app.post('/config', isUserAuthenticated, async (req, res) => {
    try {
      const body = req.body
      const user = await User.findOne({ slackId: req.user.slackId }).exec()

      user.gitlabInstanceAddress = body.gitlabInstanceAddress
      user.gitlabAccessToken = body.gitlabAccessToken

      await user.save()
  
      res.redirect('/config')
    } catch (err) {
      throw new Error(err)
    }
  })

  app.get('/', (req, res) => {
    res.render('home', { isHome: true, user: req.user })
  })
}
