import EventMap from '../../Structure/EventMap.js';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export default class extends EventMap {
  constructor(client) {
    super(client, {
      name: 'interactionCreate'
    });
  }
  run = async (interaction) => {
    if (!interaction.isButton()) return;
    
    if (interaction.customId === 'private-message') {
        const user = interaction.message.content.split(/\D+/).filter(Boolean).at(0);

        if (interaction.user.id !== user) {
            interaction.reply({ content: `${this.emoji.under} **|** Opa! Parece que a mensagem secreta está trancada com sete chaves e só o incrível <@${user}> pode dar uma espiadinha nela! 🕵️‍♂️🗝️😄`, ephemeral: true })
            return;
        }

        const message = await this.quickdb.get(`Private/Messages/${interaction.message.id}`) 
        const author = this.client.users.cache.get(message.author)

        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setLabel(`Mensagem de ${author.username}`)
            .setEmoji('📣')
            .setCustomId('static-message')
            .setDisabled(true)
        )
        interaction.reply({ content: `${message.data}`, components: [button], ephemeral: true })
    }
  }
}
