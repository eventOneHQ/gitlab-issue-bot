const express = require('express')
const passport = require('passport')
const router = express.Router()

module.exports = config => {
  // path to start the OAuth flow
  router.get('/slack', passport.authorize('Slack'))

  // OAuth callback url
  router.get(
    '/slack/callback',
    passport.authenticate('Slack', { failureRedirect: '/auth/login' }),
    (req, res) => res.redirect('/config')
  )

  // Logout route
  router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })

  // Login redirect route
  router.get('/login', (req, res) => {
    res.redirect('/auth/slack')
  })

  return router
}
