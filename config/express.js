const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

module.exports = (controller, config) => {
  const app = express()
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

  app.use(bodyParser.urlencoded({ extended: true }))

  controller.webserver = app

  app.listen(config.port, () =>
    console.log(`App listening on port ${config.port}!`)
  )

  return app
}
