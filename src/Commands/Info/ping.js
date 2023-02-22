const Commands = require('../../Handlers/commands');

module.exports = class extends Commands {
  constructor(client) {
    super(client, {
      name: 'ping',
      description: 'Veja o ping do bot',
      defer: true,
      onlyDevs: false,
    });
  }
  run(interaction) {
    interaction
      .editReply({
        content: 'Calculando sa bosta',
        fetchReply: true,
      })
      .then((message) => {
        const textPing = `Latência da minha WS: \`${this.client.ws.ping}ms\`\nLatência da API: \`${
          message.createdTimestamp - interaction.createdTimestamp
        }ms\``;

        interaction.editReply({
          content: textPing,
        });
      });
  };
};
