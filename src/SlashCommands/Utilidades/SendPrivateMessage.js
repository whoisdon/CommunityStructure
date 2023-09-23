import SlashCommands from '../../Structure/SlashCommands.js';
import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export default class extends SlashCommands {
  constructor(client) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName('send')
        .setDescription('[Utilidades] Envie mensagens privadas para usuários do servidor.')  
        .setDMPermission(false)
        .addSubcommand(subcommand => subcommand
            .setName('private')
            .setDescription('[Utilidades] Envie mensagens privadas para usuários do servidor.')
            .addUserOption(user => user
                .setName('user')
                .setDescription('[Usuário] Para qual usuário deseja enviar uma mensagem privada?')
                .setRequired(true)
            )
            .addStringOption(option => option
                .setName('message')
                .setDescription('[Conteúdo] Qual mensagem deseja enviar?')
                .setRequired(true)
            )
        )
    });
  }

  run = async (interaction) => {
    const member = interaction.options.getMember('user');
    const string = interaction.options.getString('message');

    if (!member) {
        interaction.reply({ content: `${this.emoji.under} **|** Opa! Parece que o usuário ${member.user} fez uma viagem interestelar e não esta presente no servidor. 🚀😄`, ephemeral: true });
        return;
    }

    if (member.user?.bot) {
        interaction.reply({ content: `${this.emoji.under} | Uh-oh! Parece que você está enviando mensagens codificadas para nossos amigos alienígenas! 👽🛸🤪`, ephemeral: true })
        return;
    }

    if (interaction.member === member) {
        interaction.reply({ content: `${this.emoji.under} **|** Oh, parece que você está tentando enviar uma mensagem secreta... para você mesmo! Você é seu próprio melhor amigo? 🙃📬😄`, ephemeral: true })
        return;
    }

    const button = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
        .setStyle(ButtonStyle.Success)
        .setLabel('Visualizar mensagem privada')
        .setCustomId('private-message')
    )

    interaction.channel.send({ content: `✉️ Hora da mensagem secreta para ${member}!`, components: [button] }).then(async (log) => {
        await this.quickdb.set(`Private/Messages/${log.id}`, {
            data: string,
            author: interaction.user.id
        })
        interaction.reply({ content: `✉️ ${this.emoji.rs} **|** A mensagem foi lançada com sucesso na direção de ${member}! Boa sorte no espaço das mensagens secretas! 🚀🪐`, ephemeral: true })
        return;
	})
  }
}
