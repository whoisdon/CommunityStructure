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
        if (message.content !== `${this.client.user}`) return;

        if (message.guild) {
            const prefix = await this.quickdb.get(`${message.guild?.id}/Config/SetPrefix`) ?? Config.default_prefix;
            message.reply({ content: `${this.emoji.flamengo} | Olá ${message.author}! Meu prefixo neste servidor é \`${prefix}\`, para ver o que eu posso fazer, use \`${prefix}language\`!` })
            return;
        } else {
            message.reply({ content: `Olá ${message.author}! Em mensagens diretas você não precisa usar nenhum prefixo para falar comigo! Para ver o que eu posso fazer, use \`language\`!` })
            return;
        }
    }
}
