import Events from '../../Handlers/events.js';

export default class extends Events {
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
