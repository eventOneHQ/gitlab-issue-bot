const moment = require('moment')
const matcher = require('../lib/matcher')
const gitlabApi = require('../lib/gitlabApi')

module.exports = controller => {
  // ambient issues
  controller.hears(/.*\/.*#.*/, ['ambient'], async (bot, message) => {
    const matches = await matcher('#', message)
    for (let i = 0; i < matches.length; i++) {
      const text = matches[i]
      const parts = text.parts
      const namespace = encodeURIComponent(text.namespace)
      const iid = text.iid

      const issueRes = await gitlabApi(`/projects/${namespace}/issues/${iid}`)

      const time = moment(issueRes.created_at).format('MMMM Do YYYY, h:mm:ss a')
      const assignee = issueRes.assignee
        ? issueRes.assignee.name
        : 'No assignee'

      const url = `${process.env.GITLAB_URL}/${parts[0]}/issues/${iid}`
      const issue = `${parts[0]}#${parts[1]}`

      const line1 = `> <${url}|${issue}>: \`${issueRes.state}\` ${
        issueRes.title
      }`
      const line2 = `> ${assignee} | ${time}`

      const issueMsg = `${line1}\n${line2}`
      bot.reply(message, issueMsg)
    }
  })

  // direct issues
  controller.hears(
    /.*\/.*#.*/,
    ['direct_message,direct_mention,mention'],
    function (bot, message) {
      matcher('#', message).then(res => {
        for (var i = 0; i < res.length; i++) {
          var text = res[i]
          let parts = text.parts
          let namespace = encodeURIComponent(text.namespace)
          let iid = text.iid
          gitlabApi(`/projects/${namespace}/issues/${iid}`)
            .then(res => {
              let lastUpdated = moment(res.updated_at).format(
                'MMMM Do YYYY, h:mm:ss a'
              )
              let description = res.description.replace(
                /(\r\n|\n|\r)/gm,
                function (x) {
                  return `${x}>`
                }
              )
              const due = res.due_date ? res.due_date : 'No due date'
              const milestone = res.milestone
                ? res.milestone.title
                : 'No milestone'
              const assignee = res.assignee ? res.assignee.name : 'No assignee'

              const url = `${process.env.GITLAB_URL}/${parts[0]}/issues/${iid}`
              const issue = `${parts[0]}#${parts[1]}`

              let issueMsg = `
> <${url}|${issue}> \`${res.state}\` ${res.title}
> *Description*
> ${description}
> *Assignee*
> ${assignee}
> *Last Updated*
> ${lastUpdated}
> *Due*
> ${due}
> *Popularity*
> ${res.upvotes} Upvotes | ${res.downvotes} Downvotes
> *Milestone*
> ${milestone}
> *Labels*
> ${res.labels}`
              bot.reply(message, issueMsg)
            })
            .catch(err => {
              console.log(err)
              if (err.statusCode === 404) {
                bot.reply(message, 'Issue not found.')
              } else if (err.statusCode === 500) {
                bot.reply(message, 'An error occurred.. :(')
              } else {
                bot.reply(message, err.message)
              }
            })
        }
      })
    }
  )
}
