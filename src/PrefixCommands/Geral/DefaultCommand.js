import PrefixCommands from '../../Structure/PrefixCommands.js';

export default class extends PrefixCommands {
    constructor(client) {
        super(client, {
            name: 'default',
            aliases: ['test']
        });
    }
    run = (message, args) => {
        message.reply({ content: 'hello world!' })
    }
}
