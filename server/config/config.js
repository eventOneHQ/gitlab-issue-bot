require('dotenv').config()

const config = {
  port: process.env.PORT || 3000,
  cookieKey: process.env.COOKIE_KEY,
  gitlabAppId: process.env.GITLAB_APP_ID,
  gitlabAppSecret: process.env.GITLAB_APP_SECRET,
  baseUrl: process.env.BASE_URL || 'http://localhost:3000'
}

module.exports = config
