const Events = require('../../Handlers/events');

module.exports = class extends Events {
  constructor(client) {
    super(client, {
      name: 'ready',
      once: true,
    });
  }
  run = async () => {
    await this.client.registerCommands();
  };
};
