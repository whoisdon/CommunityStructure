import 'dotenv/config';

import Client from './Handlers/client.js';
import options from './Config/options.js';

const client = new Client(options);

client.login(process.env.TOKEN);
