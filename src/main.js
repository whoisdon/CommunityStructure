const Client = require('./Handlers/client');

const options = require('./Config/options');
const client = new Client(options);

client.login(process.env.TOKEN);
