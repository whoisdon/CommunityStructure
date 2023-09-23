import Client from './Structure/AbyClient.js';

import dotenv from 'dotenv';
dotenv.config()

import options from './Config/Options.js';
const client = new Client(options);

client.login(process.env.TOKEN);
