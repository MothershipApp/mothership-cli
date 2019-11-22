# Mothership CLI

## About

Mothership CLI allows for you to sync your backups at [mothership.app](https://mothership.app) to your local development environment in seconds. first thig you will need is a [Mothership account](https://mothership.app) with some backups running so once you're setup there come on back and we'll get you syncing!

Oh... done already? Let's get started!

## Installing

This will go quick. There are a couple items that you're going to need to run Mothership CLI. Follow the instructions below to install AWS CLI and NodeJS before you install Mothership CLI.

### Requirements

#### AWS CLI

You will need the AWS CLI on your system. You can get that from here: [Installing AWS CLI version 1](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv1.html). There are [bundled installers for Linux and MacOS](https://docs.aws.amazon.com/cli/latest/userguide/install-bundle.html) and [MSI installers for Windows](https://docs.aws.amazon.com/cli/latest/userguide/install-windows.html#install-msi-on-windows).

#### NodeJS

You will need to [install NodeJS](https://nodejs.org/en/download/) on your system.

### Install Mothership CLI

To install mothership you'll want to install it globally so that it can be run from anywhere. To do that run the following on your terminal:

```sh
npm install -g mothership-cli
```

## Usage

### Syncing

```
mothership sync
```

### Resetting configuration

```
mothership reset
```

## Development

1. Clone repo
1. Install dependencies
1. Link with `npm link`
