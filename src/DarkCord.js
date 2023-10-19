import 'dotenv/config';

import DarkCordClient from './Handlers/DarkCordClient.js';
import ClientIntents from './Config/ClientIntents.js';

const client = new DarkCordClient(process.env.TOKEN, {
  gateway: {
    intents: ClientIntents
  }
});

client.connect();
