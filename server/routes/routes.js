const passport = require('passport')

module.exports = (app, config) => {
  // Middleware to check if the user is authenticated
  const isUserAuthenticated = (req, res, next) => {
    if (req.user) {
      next()
    } else {
      res.redirect('/login')
    }
  }

  app.get(
    '/auth/gitlab',
    passport.authenticate('gitlab', {
      scope: ['api']
    })
  )

  app.get(
    '/auth/gitlab/callback',
    passport.authenticate('gitlab', {
      failureRedirect: '/login'
    }),
    (req, res) => {
      // Successful authentication, redirect home.
      res.redirect('/secret')
    }
  )

  // Secret route
  app.get('/secret', isUserAuthenticated, (req, res) => {
    res.render('secret', { isSecret: true, user: req.user })
  })

  // Logout route
  app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })

  app.get('/login', (req, res) => {
    res.redirect('/auth/gitlab')
  })

  app.get('/', (req, res) => {
    res.render('home', { isHome: true, user: req.user })
  })
}
