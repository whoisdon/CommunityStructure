import EventMap from '../../Structure/EventMap.js';
import Config from "../../Config/Config.json" assert { type: "json" };

export default class extends EventMap {
  constructor(client) {
    super(client, {
      name: 'interactionCreate'
    });
  }
  run = async (interaction) => {
    const commandName = interaction.commandName;
    const command = this.client.SlashCommandArray.find((c) => c.name === commandName);

    if (interaction.isAutocomplete()) {
      await command.autocomplete(interaction);
    }

    else if (interaction.isChatInputCommand()) {
      let load = { content: `❌ **|** ${interaction.user} não foi possível executar esse comando, ele é inválido ou inexistente.`, ephemeral: true }
      if (!command) return interaction.editReply(load).catch(() => {
        interaction.reply(load)
      });

      if (command.onlyDevs && !Config.default_developers.includes(interaction.user.id)) {
        let dev = { content: `❌ **|** ${interaction.user} este comando é privado e só pode ser executado por desenvolvedores autorizados desta aplicação.`, ephemeral: true }

        this.log(`O usuário ${interaction.user.username} (${interaction.user.id}) não é um desenvolvedor setado.`, 'notice')
          return interaction.editReply(dev).catch(() => {
            return interaction.reply(dev)
          });
      }

      const noUserPerm = { content: `❌ **|** ${interaction.user} você não tem permissão para utilizar esse comando!`, ephemeral: true }
      const noBotPerm = { content: `❌ **|** ${interaction.user} eu não tenho permissão para utilizar esse comando!`, ephemeral: true }

      if (command.botPermissions && !command.botPermissions.some(role => interaction.guild.members.me.permissions.has(role))) {
        this.log(`Estou sem permissão para executar o comando ${commandName} no servidor ${interaction.guild.name} (${interaction.guild.id}).`, 'notice')
        return interaction.editReply(noBotPerm).catch(() => {
          return interaction.reply(noBotPerm)
        });
      }

      else if (command.userPermissions && !command.userPermissions.some(role => interaction.member.permissions.has(role))) {
        this.log(`O usuário ${interaction.user.username} (${interaction.user.id}) não tem permissão para executar o comando ${commandName}.`, 'notice')
        return interaction.editReply(noUserPerm).catch(() => {
          return interaction.reply(noUserPerm)
        });
      }

      if (!this.client.cooldown.has(interaction.user.id)) {
        if (!command) {
          this.log(`Ocorreu um erro ao executar o comando ${commandName}. Verifique se o comando está atualizado.`, 'notice')
          return interaction.reply({
            content: `❌ **|** Desculpe, não foi possível executar esse comando no momento. Por favor, tente novamente mais tarde ou contate o suporte caso o problema persista.`,
            ephemeral: true,
          });
        }

        const time = new Date(new Date().getTime() + (-180 * 60 * 1000));
        const date = time.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

        this.log(`O usuário ${`${interaction.user.username}`.cyan} ${`(${interaction.user.id})`.cyan} executou o comando ${`'${commandName}'`.bgMagenta}⠀ás ${`${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`.blue} no dia ${`${date}`.blue}`, 'notice')
        
        if (command.deferReply) {
            await interaction.deferReply();
        }

        command.run(interaction);
      } else {
        this.log(`O usuário ${interaction.user.username} (${interaction.user.id}) atingiu cooldawn com o comando ${commandName}, pois tentou executá-lo repetidamente.`, 'notice')
        return interaction.reply({
          content: `🚫 **|** ${interaction.user} você está em cooldown, aguarde 5 segundos para usar os comandos novamente.`,
          ephemeral: true,
        });
      }

      await this.client.cooldown.add(interaction.user.id);
      setTimeout(async () => await this.client.cooldown.delete(interaction.user.id), 5000);
    }
  }
}
