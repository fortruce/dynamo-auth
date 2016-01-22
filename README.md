# Dynamo Auth

![Circle Badge](https://circleci.com/gh/fortruce/dynamo-auth.png?circle-token=:circle-token)

# Debug EB Instance

Here are few tips for inspecting deployments to Elastic Beanstalk.

## SSH

SSH into the instance running the application with `eb ssh`. The application
resides in `/var/app/current` while running and in `/tmp/deployment/application`
during deployment. Logs can be found at `/var/log/nodejs/nodejs.log`.

## Logs

You can view recent logs using `eb logs`. It will also allow you to
download all logs.
