import Client from './Handlers/client.js';

import dotenv from 'dotenv'
dotenv.config()

import options from './Config/options.js';
const client = new Client(options);

client.login(process.env.TOKEN);
