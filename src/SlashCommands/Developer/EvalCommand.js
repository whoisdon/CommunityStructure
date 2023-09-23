import SlashCommands from '../../Structure/SlashCommands.js';
import { SlashCommandBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ModalBuilder, EmbedBuilder, AttachmentBuilder } from 'discord.js';

export default class extends SlashCommands {
  constructor(client) {
    super(client, {
      onlyDevs: true,
      guildCollection: ["1144786117862895626"],
      data: new SlashCommandBuilder()
     	.setName('eval')
     	.setDescription('[Developer] Comando privado apenas para o desenvolvedor desta aplicação.')  
        .addSubcommand(subcommand => subcommand
        	.setName('prompt')
     		.setDescription('[Developer] Comando privado apenas para o desenvolvedor desta aplicação.')  
        )
        .addSubcommand(subcommand => subcommand
        	.setName('id')
     		.setDescription('[Developer] Comando privado apenas para o desenvolvedor desta aplicação.')  
            .addStringOption(option => option 
                .setName('prompt')
                .setDescription('[Developer] Comando privado apenas para o desenvolvedor desta aplicação.')
                .setRequired(true)
            )
        )
    });
  }

  run = async (interaction) => {
    const game = interaction.options.getSubcommand()
 	  const string = interaction.options.getString('prompt')
    
    const log = new ActionRowBuilder()
    .addComponents(
        new TextInputBuilder()
        .setCustomId('eval/placeholder')
        .setLabel('Code:')
        .setStyle(TextInputStyle.Paragraph)
        .setMinLength(1)
        .setMaxLength(4000)
        .setPlaceholder('Qual será o código a ser executado?')
        .setRequired(true)
    )

    const modal = new ModalBuilder()
    .setCustomId('modals/eval')
    .setTitle('Eval Command')
    .addComponents([log]);
      
    switch (game) {
        case 'prompt': 
    		interaction.showModal(modal) 
        break;
        case 'id': 
            const query = await this.mysql.get(`Eval/Command/Prompt/Data/${string}`)
            
            if (!query) {
                interaction.reply({ content: `${this.emoji.dec} | Ops, parece que você explorou uma área inexistente em nossa base de dados: \`${string}\`. Por favor, insira uma consulta válida para continuar nossa jornada em busca de conhecimento! 🌍🔍`, ephemeral: true })
                return;
            }
            
            if (query.length >= 1024) {
                const attachment = new AttachmentBuilder(Buffer.from(query), { name: 'eval.js' });
                interaction.reply({ files: [attachment] });
                return;
            }
            
            const success = new EmbedBuilder()
            .setTitle('Finally!')
            .setColor(interaction.member.displayColor)
            .addFields({
            	name: `${this.emoji.win} Input`,
            	value: `\`\`\`js\n${query}\`\`\``
            })
            
            interaction.reply({ embeds: [success] })
            return;
        break;
    }
  }
}
