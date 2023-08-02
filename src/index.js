const axios = require('axios');
const https = require('https');
const { program } = require('commander');
const cj = require('color-json');

// this copies any values from .env onto process.env
require('dotenv').config();

const FIREHOSE_AUTH_KEY = 'x-firehose-key';

program.option('--keep-alive');

program.parse();

async function run() {
  console.log('Starting firehose client...');
  try {
    listen();
  } catch (err) {
    if (err.response) {
      console.error(err.response.data);
      console.error(err.response.status);
      console.error(err.response.headers);
    } else {
      console.error(err.message);
    }
  }
}

async function listen() {
  const stream = await initStream();
  stream
    .on('data', (chunk) => {
      try {
        // this attempts to parse the incoming chunk of data into json
        const data = JSON.parse(chunk.toString());
        // if you want to do something else with the firehose data (eg. write to a file), do it here
        console.log(cj(data));
      } catch (e) {
        // occasionally a data chunk will end in the middle of a json object.
        // the remainder of the object will be sent in the next chunk, but here
        // we just write it at as a string without trying to JSON.parse it
        process.stdout.write(chunk.toString().trim());
      }
    })
    .on('close', () => {
      console.log('Stream closed. Restarting...');
      // Whether the stream closed from client timeout or server disconnect,
      // we'll restart it to simulate a persistent connection
      listen();
    });
}

async function initStream() {
  const httpsAgent = new https.Agent({
    keepAlive: true,
    rejectUnauthorized: true,
  });

  const url = `https://${process.env.FIREHOSE_BASE_URL}/firehose`;
  const res = await axios({
    method: 'post',
    url,
    data: {
      // This designates which subscription will be used to filter data to the firehose
      subscriptionId: process.env.FIREHOSE_SUBSCRIPTION_ID,
    },
    params: {
      keep_alive: program.opts().keepAlive,
    },
    // This header token is your unique authentication token for the firehose
    headers: { [FIREHOSE_AUTH_KEY]: process.env.FIREHOSE_TOKEN },
    httpsAgent,
    maxRedirects: 0,
    responseType: 'stream',
  });

  console.log('Firehose connected. Listening for data...');

  return res.data;
}

run();

// keeps node process alive to restart the stream
setInterval(() => {}, 1 << 30);
