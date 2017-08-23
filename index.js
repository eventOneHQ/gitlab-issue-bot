const Botkit = require('botkit');
const moment = require('moment');
const gitlabApi = require('./lib/gitlabApi');
require('dotenv').config()
const env = process.env;

// config
const pkg = require('./package.json');
const controller = Botkit.slackbot({
    retry: 30
})
const bot = controller.spawn({
    token: env.SLACK_KEY
});

function matcher(seperator, message) {
    return new Promise(function (fulfill, reject) {
        let msg = message.text.split(' ');
        let itemsProcessed = 0;
        let issues = [];
        for (let i = 0; i < msg.length; i++) {
            let text = msg[i];
            if (text.indexOf('/') > -1 && text.indexOf(seperator) > -1) {
                let parts = text.split(seperator);
                let issue = {
                    parts: parts,
                    namespace: parts[0],
                    iid: parts[1]
                }
                issues.push(issue);
            }
            itemsProcessed++;
            if (itemsProcessed === msg.length) {
                return fulfill(issues);
            }
        }
    });
}

bot.startRTM(function (err, bot, payload) {
    if (err) {
        console.error(err);
        throw new Error('Could not connect to Slack');
    }

    controller.hears('version', ['direct_message,direct_mention,mention'], function (bot, message) {
        bot.reply(message, `${pkg.name} v${pkg.version}`);
    });

    // ambient issues
    controller.hears(/.*\/.*#.*/, ['ambient'], function (bot, message) {
        var msg = message.text.split(' ');
        matcher('#', message).then((res) => {
            for (var i = 0; i < res.length; i++) {
                var text = res[i];
                let parts = text.parts;
                let namespace = encodeURIComponent(text.namespace);
                let iid = text.iid;
                gitlabApi(`/projects/${namespace}/issues/${iid}`).then((res) => {
                    let time = moment(res.created_at).format('MMMM Do YYYY, h:mm:ss a');
                    let issueMsg = `
><${env.GITLAB_URL}/${parts[0]}/issues/${iid}|${parts[0]}#${parts[1]}>: \`${res.state}\` ${res.title}
>${res.assignee.name} | ${time}
                    `
                    bot.reply(message, issueMsg);
                }).catch((err) => {
                    console.log(err);
                });

            }
        });
    });

    // direct issues
    controller.hears(/.*\/.*#.*/, ['direct_message,direct_mention,mention'], function (bot, message) {
        var msg = message.text.split(' ');
        matcher('#', message).then((res) => {
            for (var i = 0; i < res.length; i++) {
                var text = res[i];
                let parts = text.parts;
                let namespace = encodeURIComponent(text.namespace);
                let iid = text.iid;
                gitlabApi(`/projects/${namespace}/issues/${iid}`).then((res) => {
                    let time = moment(res.created_at).format('MMMM Do YYYY, h:mm:ss a');
                    let lastUpdated = moment(res.updated_at).format('MMMM Do YYYY, h:mm:ss a');
                    let description = res.description.replace(/(\r\n|\n|\r)/gm, function (x) {
                        return `${x}>`
                    });
                    let due;
                    let milestone
                    if (res.due_date == null) {
                        due = 'No due date';
                    } else {
                        due = res.due_date;
                    }
                    if (res.milestone) {
                        milestone = res.milestone.title;
                    } else {
                        milestone = 'No milestone'
                    }

                    let issueMsg = `
<${env.GITLAB_URL}/${parts[0]}/issues/${iid}|${parts[0]}#${parts[1]}> \`${res.state}\` ${res.title}
>*Description*
>${description}
> *Assignee*
> ${res.assignee.name}
>*Last Updated*
>${lastUpdated}
>*Due*
>${due}
>*Popularity*
>${res.upvotes} Upvotes | ${res.downvotes} Downvotes
>*Milestone*
>${milestone}
>*Labels*
>${res.labels}
                    `
                    bot.reply(message, issueMsg);
                }).catch((err) => {
                    console.log(err);
                    if (err.statusCode === 404) {
                        bot.reply(message, 'Issue not found.');
                    } else if (err.statusCode === 500) {
                        bot.reply(message, 'An error occurred.. :(');
                    } else {
                        bot.reply(message, err.message);
                    }
                });
            }
        });
    });

    // direct milestones
    controller.hears(/.*\/.*%.*/, ['direct_message,direct_mention,mention'], function (bot, message) {
        var msg = message.text.split(' ');
        matcher('%', message).then((res) => {
            for (var i = 0; i < res.length; i++) {
                var text = res[i];
                let parts = text.parts;
                let namespace = encodeURIComponent(text.namespace);
                let iid = text.iid;
                gitlabApi(`/projects/${namespace}/milestones?iids=${iid}`).then((response) => {
                    console.log(response)
                    if (response.message || response.length === 0) {
                        bot.reply(message, 'Milestone could not be found.');
                    } else {
                        let res = response[0]
                        let time = moment(res.created_at).format('MMMM Do YYYY, h:mm:ss a');
                        let lastUpdated = moment(res.updated_at).format('MMMM Do YYYY, h:mm:ss a');
                        let description = res.description.replace(/(\r\n|\n|\r)/gm, function (x) {
                            return `${x}>`
                        });
                        let due;
                        let start;
                        if (res.due_date == null) {
                            due = 'No due date';
                        } else {
                            due = res.due_date;
                        }
                        if (res.start_date == null) {
                            start = 'No start date';
                        } else {
                            start = res.start_date;
                        }
                        let issueMsg = `
<${env.GITLAB_URL}/${parts[0]}/milestones/${iid}|${parts[0]}%${parts[1]}> \`${res.state}\` ${res.title}
>*Description*
>${description}
>*Last Updated*
>${lastUpdated}
>*Start Date*
>${start}
>*Due Date*
>${due}
                    `
                        bot.reply(message, issueMsg);
                    }
                }).catch((err) => {
                    console.log(err);
                    if (err.statusCode === 404) {
                        bot.reply(message, 'Milestone not found.');
                    } else if (err.statusCode === 500) {
                        bot.reply(message, 'An error occurred.. :(');
                    } else {
                        bot.reply(message, err.message);
                    }
                });
            }
        });
    });

    // ambient milestones
    controller.hears(/.*\/.*%.*/, ['ambient'], function (bot, message) {
        var msg = message.text.split(' ');
        matcher('%', message).then((res) => {
            for (var i = 0; i < res.length; i++) {
                var text = res[i];
                let parts = text.parts;
                let namespace = encodeURIComponent(text.namespace);
                let iid = text.iid;
                gitlabApi(`/projects/${namespace}/milestones?iids=${iid}`).then((response) => {
                    console.log(response)
                    if (response.message || response.length === 0) {
                        bot.reply(message, 'Milestone could not be found.');
                    } else {
                        let res = response[0]
                        let time = moment(res.created_at).format('MMMM Do YYYY, h:mm:ss a');
                        let due;
                        if (res.due_date == null) {
                            due = 'No due date';
                        } else {
                            due = `Due ${res.due_date}`;
                        }
                        let issueMsg = `
><${env.GITLAB_URL}/${parts[0]}/milestones/${iid}|${parts[0]}%${parts[1]}>: \`${res.state}\` ${res.title}
>${due} | Created ${time}
                    `
                        bot.reply(message, issueMsg);
                    }
                }).catch((err) => {
                    console.log(err);
                    if (err.statusCode === 404) {
                        bot.reply(message, 'Milestone not found.');
                    } else if (err.statusCode === 500) {
                        bot.reply(message, 'An error occurred.. :(');
                    } else {
                        bot.reply(message, err.message);
                    }
                });
            }
        });
    });
});