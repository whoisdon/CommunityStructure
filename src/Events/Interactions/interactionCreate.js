import Events from '../../Handlers/events.js';
import { readFile } from 'fs/promises';
import moment from 'moment';
import 'moment/locale/pt-br.js';
moment.locale('pt-br');

export default class extends Events {
  constructor(client) {
    super(client, {
      name: 'interactionCreate',
    });
  }
  run = async (interaction) => {
    
    if (!interaction.isChatInputCommand()) return;
    
    let replyInteraction = await interaction.deferReply();
    if (!replyInteraction)
      return interaction.editReply({
        content: 'Ocorreu um erro ao executar este comando...',
      });

    const commandName = interaction.commandName;
    const command = this.client.commandSlash.find((c) => c.name === commandName);
    const { developers } = JSON.parse(await readFile(`${process.cwd()}/src/Config/developers.json`, 'utf8'));

    if (command.onlyDevs && !developers.includes(interaction.user.id))
      return interaction.editReply({
        content: `${interaction.user} **|** este comando é privado apenas para desenvolvedores desta aplicação!`,
        ephemeral: true,
      });

    if (command.permissions) {
      if (!interaction.member.permissions.has(command.permissions)) {
        return interaction.reply({ content: 'Você não tem perm' });
      }
      else if (!interaction.guild.members.me.permissions.has(command.permissions)) {
        return interaction.reply({ content: 'Eu não tenho perm bro' });
      }
    }

    if (!this.client.cooldown.has(interaction.user.id)) {
      if (!command) {
        return interaction.reply({
          content: 'Ocorreu um erro ao executar este comando...',
          ephemeral: true,
        });
      }
      else command.run(interaction);
    } else {
      return interaction.reply({
        content: 'Você está em cooldown, aguarde 5 segundos para usar os comandos novamente.',
        ephemeral: true,
      });
    }

    await this.client.cooldown.add(interaction.user.id);
    setTimeout(async () => {
      await this.client.cooldown.delete(interaction.user.id);
    }, 5000);
  };
};
