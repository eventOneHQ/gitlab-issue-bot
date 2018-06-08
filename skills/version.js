const pkg = require('../package.json')

module.exports = controller => {
  controller.hears(
    'version',
    ['direct_message,direct_mention,mention'],
    (bot, message) => {
      bot.reply(message, `${pkg.name} v${pkg.version}`)
    }
  )
}
