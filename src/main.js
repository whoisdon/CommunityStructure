const Client = require('./Handlers/client');

require('dotenv').config()

const options = require('./Config/options');
const client = new Client(options);

client.login(process.env.TOKEN);
