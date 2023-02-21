const Events = require('../../Handlers/events');
const { developers } = require('../../Config/developers.json');

module.exports = class extends Events {
  constructor(client) {
    super(client, {
      name: 'interactionCreate',
    });
  }
  run = async (interaction) => {
    
    if (!interaction.isChatInputCommand()) return;

    const commandName = interaction.commandName;
    const command = this.client.commandSlash.find((c) => c.name === commandName);

    if (command.onlyDevs && !developers.includes(interaction.user.id))
      return interaction.editReply({
        content: `${interaction.user} **|** este comando é privado apenas para desenvolvedores desta aplicação!`,
        ephemeral: true,
      });

      if (!interaction.guild && command.permissions) throw new Error("[PERMISSIONS_COMMAND]: Cannot use 'permissions' in dm interactions")
      
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
        command.defer ? await interaction.deferReply() : false;
        command.run(interaction);
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
