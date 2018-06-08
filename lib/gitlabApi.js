const axios = require('axios')
require('dotenv').config()
const env = process.env
const gitlabKey = env.GITLAB_KEY

const gitlabApi = async endpoint => {
  const url = `${env.GITLAB_URL}/api/v4${endpoint}`
  const options = {
    url: url,
    headers: {
      'User-Agent': 'Request-Promise',
      'PRIVATE-TOKEN': gitlabKey
    }
  }

  const response = await axios(options)
  return response.data
}

module.exports = gitlabApi
