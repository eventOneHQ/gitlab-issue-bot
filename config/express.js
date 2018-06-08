const cookieSession = require('cookie-session')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

module.exports = (app, config) => {
  app.engine(
    '.hbs',
    exphbs({
      defaultLayout: 'main',
      extname: '.hbs'
    })
  )
  app.set('view engine', '.hbs')

  // You must use a body parser for JSON before mounting the adapter
  app.use(bodyParser.json())
  // cookieSession config
  app.use(
    cookieSession({
      maxAge: 24 * 60 * 60 * 1000, // One day in milliseconds
      keys: [config.cookieKey]
    })
  )
}
