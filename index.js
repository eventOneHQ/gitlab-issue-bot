const Botkit = require('botkit');
const controller = Botkit.slackbot();
const moment = require('moment');
const getIssue = require('./lib/getIssue');

// config
const config = require('./config.json');
const pkg = require('./package.json');
const bot = controller.spawn({
    token: config.slackKey || process.env.SLACK_KEY,
    retry: 30
});

bot.startRTM(function (err, bot, payload) {
    if (err) {
        console.error(err);
        throw new Error('Could not connect to Slack');
    }
    controller.hears(/.*/, ['ambient'], function (bot, message) {
        var msg = message.text.split(' ');
        for (var i = 0; i < msg.length; i++) {
            var text = msg[i];
            if (text.indexOf('/') > -1 && text.indexOf('#') > -1) {
                let parts = text.split('#');
                let namespace = encodeURIComponent(parts[0]);
                let iid = parts[1];
                getIssue(namespace, iid).then((res) => {
                    let time = moment(res.created_at).format('MMMM Do YYYY, h:mm:ss a');
                    let issueMsg = `
><${config.gitlabBaseUrl}/${parts[0]}/issues/${iid}|${parts[0]}#${parts[1]}>: \`${res.state}\` ${res.title}
>${res.assignee.name} | ${time}
                    `
                    bot.reply(message, issueMsg);
                }).catch((err) => {
                    console.log(err);
                });
            }
        }
    });


    controller.hears('version', ['direct_message,direct_mention,mention'], function (bot, message) {
        bot.reply(message, `${pkg.name} v${pkg.version}`);
    });

    controller.hears(/.*/, ['direct_message,direct_mention,mention'], function (bot, message) {
        var msg = message.text.split(' ');
        for (var i = 0; i < msg.length; i++) {
            var text = msg[i];
            if (text.indexOf('/') > -1 && text.indexOf('#') > -1) {
                let parts = text.split('#');
                let namespace = encodeURIComponent(parts[0]);
                let iid = parts[1];
                getIssue(namespace, iid).then((res) => {
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
<${config.gitlabBaseUrl}/${parts[0]}/issues/${iid}|${parts[0]}#${parts[1]}> \`${res.state}\` ${res.title}
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
        }
    });
});