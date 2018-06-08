require('dotenv').config()

const config = {
  port: process.env.PORT || 3000,
  cookieKey: process.env.COOKIE_KEY,
  gitlabAppId: process.env.GITLAB_APP_ID,
  gitlabAppSecret: process.env.GITLAB_APP_SECRET,
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  dbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/glib',
  slack: {
    verificationToken: process.env.SLACK_VERIFICATION_TOKEN
  }
}

module.exports = config
