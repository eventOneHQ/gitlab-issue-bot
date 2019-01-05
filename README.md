# GitLab Issue Bot for Slack

[![Docker Pulls](https://img.shields.io/docker/pulls/filiosoft/gitlab-issue-bot.svg)](https://hub.docker.com/r/filiosoft/gitlab-issue-bot/)
[![Docker Build Status](https://img.shields.io/docker/build/filiosoft/gitlab-issue-bot.svg)](https://hub.docker.com/r/filiosoft/gitlab-issue-bot)
[![MicroBadger Size](https://img.shields.io/microbadger/image-size/filiosoft/gitlab-issue-bot.svg)](https://hub.docker.com/r/filiosoft/gitlab-issue-bot)

A Slack bot that connects to GitLab Issues

GitLab Issue Bot will notice references to GitLab Issues, automatically get the latest issue info from GitLab and respond with it!

## Getting Started

### Configuration

Add the following to a `.env` file (or `docker-compose.yml` if you are using Docker).

```
SLACK_KEY=xxx-xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx # Your Slack API key
GITLAB_KEY=xxxxxxxxxxxxxxxxxxxx # Your GitLab private token
GITLAB_URL=https://gitlab.com # The base URL of your instance - no trailing slashes
```

### Run

To start the bot, first install the dependencies:

```bash
$ npm install
```

Then start the bot:

```bash
$ npm start
```

### Run with Docker

To run with `docker-compose`, first copy the config:

```bash
$ cp docker-compose.exmaple.yml docker-compose.yml
```

Then open the `docker-compose.yml` and set the environment variables as describled above.

Finally, run the bot:

```bash
$ docker-compose up -d
```

### Run with Kubernetes

To run on Kubernetes, frist, create a secret with your Slack and Gitlab keys.

```bash
kubectl create secret generic gitlab-issue-bot --from-literal=slackToken=<your_slack_token_here> --from-literal=gitlabKey=<your_gitlab_key_here>
```

Then, run the following to deploy!

```bash
kubectl apply -f https://raw.githubusercontent.com/eventOneHQ/gitlab-issue-bot/master/k8s/deployment.yaml
```
