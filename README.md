# Firehose Node.js client

This is an example client written in Node.js that demonstrates how to connect to the Reddit Data Firehose.

## Installation

Requires [Node.js](https://www.nodejs.org) 18.18.2 or higher.

To install the client dependencies, run the command:

`npm install`

## Setup

Copy the contents of `.env.example` into a new file called `.env` in the root of this directory.

Contact your Reddit contact to get an auth token and a Subscription ID.

For the Subscription ID, you can supply these filters:

- Events
  - POST_CREATE
  - COMMENT_CREATE
  - POST_EDIT
  - COMMENT_EDIT
  - POST_DELETE
  - COMMENT_DELETE
  - VOTE
  - MOD_ACTION
- Subreddits
  - Provide as subreddit name (eg. pics) or id (eg. t5_2qh0u)

Once you've received an auth token and subscript ID, modify your `.env` file.

Set the value of `FIREHOSE_TOKEN` to the auth token you received.

Set the value of `FIREHOSE_SUBSCRIPTION_ID` to the subscription ID you received.

## Usage

`npm start`

The application will start and begin logging received events to stdout. When the connection closes, it will reinitiate. Enter CTRL+C to end the program.
