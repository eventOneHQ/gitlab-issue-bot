const cookieSession = require('cookie-session')
const exphbs = require('express-handlebars')

module.exports = (app, config) => {
  app.engine(
    '.hbs',
    exphbs({
      defaultLayout: 'main',
      extname: '.hbs'
    })
  )
  app.set('view engine', '.hbs')

  // cookieSession config
  app.use(
    cookieSession({
      maxAge: 24 * 60 * 60 * 1000, // One day in milliseconds
      keys: [config.cookieKey]
    })
  )
}
