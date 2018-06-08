const express = require('express')
const passport = require('passport')
const router = express.Router()

module.exports = config => {
  router.get(
    '/gitlab',
    passport.authenticate('gitlab', {
      scope: ['api']
    })
  )

  router.get(
    '/gitlab/callback',
    passport.authenticate('gitlab', {
      failureRedirect: '/auth/login'
    }),
    (req, res) => {
      // Successful authentication, redirect home.
      res.redirect('/secret')
    }
  )

  // Logout route
  router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })

  // Login redirect route
  router.get('/login', (req, res) => {
    res.redirect('/auth/gitlab')
  })

  return router
}
