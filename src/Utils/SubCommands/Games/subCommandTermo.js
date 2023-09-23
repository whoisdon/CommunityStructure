import duid from "short-duid-js";
import wordsCorrect from '../../.cache/.termoCache.json' assert { type: "json" };
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder } from "discord.js";

const removeAcento = (text) => {
    return text
        .toLowerCase()
        .replace(/[áàâã]/gi, 'a')
        .replace(/[éèê]/gi, 'e')
        .replace(/[íìî]/gi, 'i')
        .replace(/[óòôõ]/gi, 'o')
        .replace(/[úùû]/gi, 'u')
        .replace(/[ç]/gi, 'c');
}

var { easy, words } = wordsCorrect;
easy, words = [...easy.map(e => removeAcento(e), words)]

class TermoCommand {
    constructor (emoji) {
        this.emoji = emoji;
        this.games = new Map();
        this.duid = new duid.init(0, "stars-duid-gen", 0);
    }

    getRandomWord () {
        return removeAcento(easy[~~(Math.random() * easy.length)]);
    }

    createGameObject(id, interaction) {
        return {
            id: id,
            correct: this.getRandomWord(),
            inputs: [],
            user: interaction.user,
            userId: interaction.user.id,
            message: null,
            messageId: null,
            guild: interaction.guild,
            guildId: interaction.guildId,
            interaction: interaction
        }
    }

    getImage(board) {
        const guessed = board.inputs.join(",");
        const imageUrl = board.inputs.length === 0
            ? process.cwd() + "/src/Utils/Images/termo.png"
            : `https://api.gamecord.xyz/wordle?word=${board.correct}&guessed=${guessed}`;
    
        return new AttachmentBuilder(imageUrl, {
            name: "termo.png"
        });
    }

    createButton(board) {
        return new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`${board.id}`)
                    .setLabel("Adivinhe agora")
            		.setEmoji("<a:response:1148012852343476325>")
                    .setStyle(ButtonStyle.Secondary)
            );
    }

    createModal(board) {
        return new ModalBuilder()
            .setCustomId(`modal_${board.id}_${board.inputs.length}`)
            .setTitle("Termo")
            .addComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId("word_response")
                            .setMinLength(5)
                            .setMaxLength(5)
                            .setLabel("Termo")
                            .setPlaceholder("Qual a palavra?")
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                    )
            )
    }

    async createGame(interaction) {
        const [id] = this.duid.getDUIDInt(1);
        const board = this.createGameObject(id, interaction);
        const row = this.createButton(board);
      
        const message = await interaction.reply({
          components: [row],
          files: [this.getImage(board)]
        });
      
        board.message = message;
        board.messageId = message.id;
      
        const filter = (i) => {
            if (i.user.id !== interaction.user.id) {
                i?.reply({ content: `${this.emoji.under} **|** ${i.user} apenas ${interaction.user} pode interagir com os botões!`, ephemeral: true }).catch(() => { });
                return false;
            }
            return true;
        };

        const collector = message.createMessageComponentCollector({
          componentType: ComponentType.Button,
          idle: 60 * 1000 * 5,
          filter
        });
      
        collector.on("collect", async (i) => {
          i.showModal(this.createModal(board));
          const response = await i.awaitModalSubmit({
            filter: (e) => e.customId.startsWith(`modal_${board.id}`),
            time: 60 * 1000 * 5,
            max: 1,
          });
      
          if (response) {
            const [_1, _id, count] = response.customId.split("_");
            if (count != board.inputs.length) {
              return;
            }
            const word = removeAcento(response.fields.getTextInputValue('word_response').toLowerCase());
      
            if (word && words.includes(word)) {
              board.inputs.push(word);
      
              if (word === board.correct) {
                await message.edit({
                  components: [],
                  files: [this.getImage(board)]
                });
                response.reply({ content: `Parabéns! 🥳 Você acertou a palavra secreta "\`${board.correct}\`" e venceu o jogo! 🎉 Que talento!` });
              } else if (board.inputs.length > 5) {
                await message.edit({
                  components: [],
                  files: [this.getImage(board)]
                }).catch(() => {  });;
                await response.reply({ content: `Oops! ${this.emoji.under} Você errou a palavra! A partida acabou. A palavra correta era "\`${board.correct}\`"! 🎉`, ephemeral: true }).catch(() => {  });;
              } else {
                await response.update({
                  files: [this.getImage(board)]
                }).catch(() => {  });
              }
            } else {
              await response.reply({ content: `Ops! "\`${word}\`" não é uma palavra aceita! ${this.emoji.under} Tente outra!`, ephemeral: true }).catch(() => {  });
            }
          }
        });      

        collector.on("end", (_, reason) => {
            if (reason === "time"){
                message.edit({
                    content: `${this.emoji.dec} **|** O tempo voou mais rápido do que o Flash! Você está fora de tempo! ⌛🏃‍`,
                    components: []
                })
            }
        });
    }
}

export default TermoCommand;
