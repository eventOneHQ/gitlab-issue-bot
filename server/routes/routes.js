module.exports = (app, config) => {
  // Middleware to check if the user is authenticated
  const isUserAuthenticated = (req, res, next) => {
    if (req.user) {
      next()
    } else {
      res.redirect('/auth/login')
    }
  }

  app.use('/auth', require('./auth.js')(config))

  // Secret route
  app.get('/secret', isUserAuthenticated, (req, res) => {
    res.render('secret', { isSecret: true, user: req.user })
  })

  app.get('/', (req, res) => {
    res.render('home', { isHome: true, user: req.user })
  })
}
