import DarkCordClient from './Handlers/DarkCordClient.js';

import dotenv from 'dotenv';
dotenv.config();

import ClientIntents from './Config/ClientIntents.js';

const client = new DarkCordClient(process.env.TOKEN, {
  gateway: {
    intents: ClientIntents,
  }
});

client.connect();
