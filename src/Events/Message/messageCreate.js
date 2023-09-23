import EventMap from '../../Structure/EventMap.js';
import Config from '../../Config/Config.json' assert { type: "json" };

export default class extends EventMap {
    constructor(client) {
        super(client, {
            name: 'messageCreate'
        });
    }
    run = async (message) => {
        if (message.author.bot) return;

        const prefix = await this.quickdb.get(`${message.guild?.id}/Config/SetPrefix`) ?? Config.default_prefix;

        const time = new Date(new Date().getTime() + (-180 * 60 * 1000));
        const date = time.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        const [pv, ...argsArray] = message.content.trim().split(" ");

        if (!message.guild && this.client.PrefixCommandArray.some(command => command.name.toLowerCase() === pv.toLowerCase())) {
            const command = this.client.PrefixCommandArray.find(cmd => cmd.name.toLowerCase() === pv.toLowerCase());
            if (command.isPrivate && !message.guild) return;
            if (command.onlyDevs && !Config.default_developers.includes(message.author.id)) return;

            this.log(`O usuário ${`${message.author.username}`.cyan} ${`(${message.author.id})`.cyan} executou o comando ${`'${command.name}'`.bgMagenta}⠀ás ${`${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`.blue} no dia ${`${date}`.blue}`, 'notice')
            command.run(message, argsArray);
            return;
        }
        
        const startCommand = message.content.toLowerCase().startsWith(`<@${this.client.user.id}>`);

        if (!(message.content.toLowerCase().startsWith(prefix) || startCommand)) return;

        const content = startCommand ? message.content.slice(`<@${this.client.user.id}>`.length).trim() : message.content.slice(prefix.length).trim();
        const [cmd, ...args] = content.split(" ");
        const command = this.client.PrefixCommandArray.find((c) => c.name === cmd.toLowerCase() || c.aliases?.includes(cmd.toLowerCase()))

        if (!command) return;
        if (!command?.mentionCommand && startCommand) return;
        if (command.isPrivate && !message.guild) return;

        if (command.onlyDevs && !Config.default_developers.includes(message.author.id)) {
            this.log(`O usuário ${message.author.username} (${message.author.id}) não é um desenvolvedor setado.`, 'notice')
            return;
        }

        if (Array.isArray(command.guildCollection) && !command.guildCollection.includes(message.guild?.id)) return;

        if (message.guild) {
            if (command.botPermissions && !command.botPermissions.some(role => message.guild.members.me.permissions.has(role))) {
                this.log(`Estou sem permissão para executar o comando ${cmd} no servidor ${message.guild.name} (${message.guild.id}).`, 'notice')
                message.reply({
                    content: `❌ **|** ${message.author} eu não tenho permissão para utilizar esse comando!`
                }).then(m => setTimeout(() => m?.delete(), 5000)).catch(() => { })
                return;
            }
            
            if (command.userPermissions && !command.userPermissions.some(role => message.member.permissions.has(role))) {
                this.log(`O usuário ${message.author.username} (${message.author.id}) não tem permissão para executar o comando ${cmd}.`, 'notice')
                message.reply({
                    content: `❌ **|** ${message.author} você não tem permissão para utilizar esse comando!`
                }).then(m => setTimeout(() => m?.delete(), 5000))
                return;
            }
        }

        if (!this.client.cooldown.has(message.author.id)) {
            this.log(`O usuário ${`${message.author.username}`.cyan} ${`(${message.author.id})`.cyan} executou o comando ${`'${cmd}'`.bgMagenta}⠀ás ${`${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`.blue} no dia ${`${date}`.blue}`, 'notice')
            command.run(message, args);
        } else {
            this.log(`O usuário ${`${message.author.username}`.cyan} ${`(${message.author.id})`.cyan} atingiu cooldawn com o comando ${`'${cmd}'`.bgMagenta}, pois tentou executá-lo repetidamente.`, 'notice')
            message.reply({
                content: `🚫 **|** ${message.author} você está em cooldown, aguarde 5 segundos para usar os comandos novamente.`
            }).then((m) => setTimeout(() => m?.delete(), 5000));
            return;
        }

        await this.client.cooldown.add(message.author.id);
        setTimeout(async () => await this.client.cooldown.delete(message.author.id), 5000);
    }
}
