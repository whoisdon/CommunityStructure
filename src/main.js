const Client = require('./Handlers/client');

const options = require('./Config/options');
const client = new Client(options);

require('./Utils/process')(client);

module.exports = client;

client.login(process.env.TOKEN);
