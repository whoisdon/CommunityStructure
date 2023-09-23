import EventMap from '../../Structure/EventMap.js';
import { EmbedBuilder, AttachmentBuilder } from 'discord.js';
import { inspect } from 'util';
import { createRequire } from 'module';
import { exec } from 'child_process';
import { v4 as uuidv4 } from 'uuid';

const require = createRequire(import.meta.url);

import dotenv from 'dotenv';
dotenv.config();

export default class extends EventMap {
    constructor(client) {
        super(client, {
            name: 'interactionCreate',
        });
    }

    dockerShell = (command) => {
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                } else {
                    resolve({
                        stdout,
                        stderr
                    });
                }
            });
        });
    };

    run = async (interaction) => {
        let consoleOutput = '';

        const consoleLog = (...args) => {
            consoleOutput += args.map(arg => inspect(arg)).join(' ') + '\n';
        };

        const originalConsole = console;
            console = {
                log: consoleLog
        }
        
        const embed = new EmbedBuilder()
            .setTitle('Error')
            .setColor('#FF0000');

        const success = new EmbedBuilder()
            .setTitle('Finally!')
            .setColor(interaction.member.displayColor);

        if (!interaction.isModalSubmit() || interaction.customId !== "modals/eval") return;

        const code = interaction.fields.getTextInputValue('eval/placeholder');
		const uniqueId = uuidv4();
        
        await interaction.deferReply()
        
        if (code.startsWith('globalCLI')) {
            const parts = code.split('=');
            const value = parts[1].trim();

            this.dockerShell(value).then(async ({ stdout, stderr }) => {
                if (stderr) {
                    embed.setDescription(`An error occurred while evaluating the code:\n\`\`\`js\n${stderr}\`\`\` `)
                    await interaction.editReply({
                        embeds: [embed]
                    })
                    return;
                } else if (stdout.length >= 1024) {
                    const attachment = new AttachmentBuilder(Buffer.from(stdout), {
                        name: 'eval.bash'
                    });
                    await interaction.editReply({
                        files: [attachment]
                    })
                    return;
                }

                success.addFields({
                    name: `${this.emoji.win} Input`,
                    value: `\`\`\`js\n${value}\`\`\``
                }, {
                    name: "Output",
                    value: `\`\`\`js\n${stdout}\`\`\``
                })

                await interaction.editReply({
                    embeds: [success]
                })
                return;
            }).catch(async (error) => {
                embed.setDescription(`An error occurred while evaluating the code:\n\`\`\`js\n${error}\`\`\` `)
                await interaction.editReply({
                     embeds: [embed]
                })
                return;
            })
        } else {
            try {
                let evaled = await eval(code);
                evaled = (typeof evaled !== "string") ? inspect(evaled) : evaled;

                if (consoleOutput) {
                    evaled += '\n> ' + consoleOutput;
                } else if (evaled?.includes(process.env.TOKEN)) {
                    await interaction.editReply({
                        content: `Haha! Pegadinha do malandro! Você achou que veria o token secreto do bot? Nice try! Mas o token está bem guardado em um local secreto e seguro. Continue sonhando em decifrá-lo! ${this.emoji.win}`,
                        ephemeral: true
                    });
                    return;
                } else if (evaled.length >= 1024) {
                    const attachment = new AttachmentBuilder(Buffer.from(evaled), {
                        name: 'eval.elixir'
                    });
                    
                    await interaction.editReply({
                        content: `ID **|** \`${uniqueId}\``,
                        files: [attachment]
                    }).then(async () => {
                        await this.mysql.set(`Eval/Command/Prompt/Data/${uniqueId}`, code)
                    });
                    return;
                }

                success.addFields({
                    name: `${this.emoji.win} Input`,
                    value: `\`\`\`js\n${code}\`\`\``
                }, {
                    name: "Output",
                    value: `\`\`\`js\n${evaled}\`\`\``
                })

                await interaction.editReply({
                    embeds: [success]
                });
                return;
            } catch (error) {
                embed.setDescription(`An error occurred while evaluating the code:\n\`\`\`js\n${error}\`\`\` `)

                await interaction.editReply({
                    content: `ID **|** \`${uniqueId}\``,
                    embeds: [embed]
                }).then(async () => {
                    await this.mysql.set(`Eval/Command/Prompt/Data/${uniqueId}`, code)
                });
            } finally {
                console = originalConsole;
            }
        }
    }
}
