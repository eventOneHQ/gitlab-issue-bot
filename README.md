# GitLab Issue Bot for Slack

A Slack bot that connects to GitLab Issues

## Configuration
Add the following to the `config.json` file. 
```javascript
{
    "slackKey": "xxx-xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx", // Your Slack API key
    "gitlabKey": "xxxxxxxxxxxxxxxxxxxx", // Your GitLab private token
    "gitlabBaseUrl": "https://gitlab.com" // The base URL of your instance - no trailing slashes
}
```

## Run

```bash
$ npm start
```