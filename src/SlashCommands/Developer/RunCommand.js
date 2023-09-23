import SlashCommands from '../../Structure/SlashCommands.js';
import cache from '../../Utils/.cache/.runtimesCache.json' assert { type: "json" };

import { fromString } from 'wandbox-api-updated';
import { SlashCommandBuilder, TextInputStyle, ModalBuilder, EmbedBuilder, TextInputBuilder, ActionRowBuilder, AttachmentBuilder  } from 'discord.js';

export default class extends SlashCommands {
  constructor(client) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName('run')
        .setDescription('[Developer] Explore, teste e crie no nosso ambiente seguro e divertido!')
        .addStringOption(option => option
          .setName('language')
          .setDescription('[Language] Escolha a linguagem perfeita para dar vida aos seus projetos!')
          .setAutocomplete(true)
          .setRequired(true)
        )
    });
  }

  autocomplete = async (interaction) => {
      const focusedOption = interaction.options.getFocused(true);

      if (focusedOption.value.length <= 0) {
        const uniqueLanguageNames = [];

        cache.forEach(item => {
          if (item.name.startsWith(focusedOption.value)) {
            const languageName = item.name.split('-')[0];
            if (!uniqueLanguageNames.includes(languageName)) {
              uniqueLanguageNames.push(languageName);
            }
          }
        });

        const filteredLanguages = uniqueLanguageNames.slice(0, 25);

        const response = filteredLanguages.map(languageName => {
        const version = cache.find(item => item.name.startsWith(languageName)).name.split('-')[1];

        return {
            name: `${languageName} (${/\d/.test(version) ? 'v' + version : version})`,
            value: languageName,
          };
        });

        await interaction.respond(response);
      } else {
        const filtered = cache.filter(item =>
          item.name.startsWith(focusedOption.value)
        ).slice(0, 25);

        await interaction.respond(filtered.map(item => ({
          name: `${item.name.split('-')[0]} (${/\d/.test(item.name.split('-')[1]) ? 'v' + item.name.split('-')[1] : item.name.split('-')[1] || 'latest'})`,
          value: item.name,
        })));
      }
  }
  
  run = async (interaction) => {
    const test = interaction.options.getString('language');
    const info = cache.find(item => item.name === test);

	if (!info) {
        interaction.reply({ content: `${this.emoji.dec} **|** Cuidado, herói! Parece que você escolheu uma opção fora da Batcaverna: \`${test}\`. Tente novamente com uma escolha válida para proteger Gotham City! 🦇💥`, ephemeral: true });
        return;
	}
      
    const embed = new EmbedBuilder()
      .setTitle('Error')
      .setColor('#FF0000');

    const log = new ActionRowBuilder()
    .addComponents(
      new TextInputBuilder()
      .setCustomId('wandbox/placeholder')
      .setLabel('Code:')
      .setStyle(TextInputStyle.Paragraph)
      .setMinLength(1)
      .setMaxLength(4000)
      .setPlaceholder('Vamos codar! O que você tem para executar?')
      .setRequired(true)
    )

    const modal = new ModalBuilder()
      .setCustomId('wandbox')
      .setTitle('Kuruminha Wandbox')
      .addComponents([log]);

    await interaction.showModal(modal);

    const filter = (i) => i.customId === 'wandbox';

    const placeholder = await interaction.awaitModalSubmit({ filter, time: 60 * 1000 * 5, max: 1 });
    const code = placeholder.fields.getTextInputValue('wandbox/placeholder');

    await placeholder.deferReply();
      
    try {
      const response = await fromString({
        	code: code,
        	compiler: info.name,
      })

      const output = response.program_output;
      const stderr = response.program_error;

      if (output.length <= 0 && stderr.length <= 0) {
        await placeholder.editReply({ content: `${this.emoji.rs}\`Output\` \`\`\`> undefined\`\`\`` });
        return;
      }

      else if (output) {
        if (output.length >= 1024) {
          const attachment = new AttachmentBuilder(Buffer.from(output), {
            name: `run.txt`
          });
          await placeholder.editReply({ files: [attachment] });
          return;
        } else {
          await placeholder.editReply({ content: `${this.emoji.rs}\`Output\` \`\`\`${output}\`\`\`` });
          return;
        }
      } else if (stderr) {
        embed.setDescription(`An error occurred while evaluating the code:\n\`\`\`js\n${stderr}\`\`\``);
        await placeholder.editReply({ embeds: [embed] });
        return;
      }
    } catch (e) {
      embed.setDescription(`An error occurred while evaluating the code:\n\`\`\`js\n${e}\`\`\``);
      await placeholder.editReply({ embeds: [embed] });
      return;
    }
  }
}
