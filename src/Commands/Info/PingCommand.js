import Commands from '../../Handlers/CommandsMap.js';

export default class extends Commands {
  constructor(client) {
    super(client, {
      name: 'ping',
      description: 'Veja o ping do bot',
      defer: true,
      onlyDevs: false
    });
  }
   run(interaction) {
     
    const latency = performance.now();
     
    interaction
      .editOriginalReply({
      content: 'Calculando sa bosta'
      })
      .then(() => {
       const textPing = `Latência da minha WS: \`${this.client.websocket.ping}ms\`\nLatência da Resposta: \`${
          (performance.now() - latency) >> 0
        }ms\``;

        interaction.editOriginalReply({
          content: textPing
        });

      });
  };
};
