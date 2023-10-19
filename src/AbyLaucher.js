import 'dotenv/config';

import Client from './Structure/AbyClient.js';
import options from './Config/Options.js';

const client = new Client(options);

client.login(process.env.TOKEN);
