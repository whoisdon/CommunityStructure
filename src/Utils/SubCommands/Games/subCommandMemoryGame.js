import { ActionRowBuilder, ButtonStyle, ButtonBuilder } from 'discord.js';

const subCommandMemoryGame = async ({ interaction, emoji }) => {
    const dif = interaction.options.getString('dificuldade') || '_easy';
    var emojis = emoji.fruits;
 	var lolInteraction = true;
    var timer = true;
    let intervalId;
    
    const dificuldade = {
        _easy: 300000,
        _average: 180000,
        _hard: 90000
    }
    
    if (dif === '_average') {
        emojis = emoji.pepe;
    }
    else if (dif === '_hard') {
        emojis = emoji.cards;
    }

    const totalPairs = 10;
    var user = true;
    
    user = false;
    
    const rows = 5;  
    const columns = 4; 
    
    const emojiPairs = [];
    for (let i = 0; i < totalPairs; i++) {
        emojiPairs.push(emojis[i % emojis.length], emojis[i % emojis.length]);
    }
    emojiPairs.sort(() => Math.random() - 0.5);
    
    const buttons = [];
    
    for (let y = 0; y < rows; y++) {
        const row = [];
    
        for (let x = 0; x < columns; x++) {
            const index = y * columns + x;
    
            const emojiIndex = index % (totalPairs * 2);
    
            const button = new ButtonBuilder()
                .setCustomId(`${interaction.user.id}-${x}-${y}`)
                .setEmoji(emojiPairs[emojiIndex])
                .setStyle(ButtonStyle.Secondary);
    
            row.push(button);
        }
    
        buttons.push(row);
    }
    
    const buttonRows = buttons.map(row => new ActionRowBuilder().addComponents(...row));
    
    const reply = await interaction.reply({
        content: 'Jogo da Memória!',
        components: buttonRows,
        fetchReply: true
    });
    
    
    const intervaloMensagem = 10000;
    let tempoRestante = dificuldade[dif];
    
    const enviarMensagem = async () => {
        if (tempoRestante > 0 && timer) {
            const minutos = ~~(tempoRestante / 60000);
            const segundos = ((tempoRestante % 60000) / 1000).toFixed(0);
            const min = minutos === 1 ? 'minuto' : 'minutos'
            const mens = minutos === 0 ? `\`${segundos}\` segundos` : `\`${minutos}\` ${min} e \`${segundos}\` segundos`
            if (segundos <= '30' && minutos === 0) {
                await reply?.edit({ content: `O relógio está correndo! ⏳ Você só tem mais ${mens} para encontrar todos os pares de cartas!` }).catch(() => { })
            } else {     
            	await reply?.edit({ content: `Vamos testar sua memória! 🧠🃏 Ainda restam ${mens} para encontrar todos os pares de cartas! Boa sorte! 🎮🕒` }).catch(() => { })
            }
            tempoRestante -= intervaloMensagem;
        } else {
            timer = false;
            clearInterval(intervalId);
            reply?.edit({ content: `${emoji.dec} **|** O tempo voou mais rápido do que o Flash! Você está fora de tempo! ⌛🏃‍♂️`, components: [] }).catch(() => { }).then(async () => {
                if (reply.components?.length > 0) {
                    await reply?.edit({ components: [] }).catch(() => {  })
                    return;
                }
            })
        }
    }
    
    setTimeout(async () => {
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < columns; x++) {
                const newButton = new ButtonBuilder()
                    .setCustomId(`${interaction.user.id}-${x}-${y}`)
                    .setEmoji(emoji.joker)
                    .setStyle(ButtonStyle.Primary);
                buttonRows[y].components[x] = newButton;
            }
        }
        await reply?.edit({ content: 'Jogo da Memória!', components: buttonRows }).then(() => user = true);
    }, 3000);
     
    
        const filter = (i) => {
            if (i.user.id !== interaction.user.id) {
                i?.reply({ content: `${emoji.under} **|** ${i.user} apenas ${interaction.user} pode interagir com os botões!`, ephemeral: true }).catch(() => { });
                return false;
            }
            return true;
        };
        const collector = reply.createMessageComponentCollector({ filter });

        let firstButtonInteraction = null

        collector.on('collect', async (interaction) => {
            if (lolInteraction) {
                lolInteraction = false;
                intervalId = setInterval(enviarMensagem, intervaloMensagem);
                enviarMensagem();
            }
            
            const [userId, x, y] = interaction.customId.split('-'); 
            const emojiIndex = y * columns + parseInt(x);
        
            const newButton = new ButtonBuilder()
                .setCustomId(interaction.customId)
                .setEmoji(emojiPairs[emojiIndex])
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true);
            
            if (!user) {
                await interaction.reply({ content: `${emoji.dec} **|** Segura aí, Flash! Você está indo rápido demais.`, ephemeral: true })
                return;
            }

            const buttonRow = buttonRows[y];
            buttonRow.components[x] = newButton;
        
            if (!firstButtonInteraction) {
                firstButtonInteraction = interaction;
            } else {
                const firstEmoji = emojiPairs[y * columns + parseInt(x)];
                const secondEmoji = emojiPairs[firstButtonInteraction.customId.split('-')[2] * columns + parseInt(firstButtonInteraction.customId.split('-')[1])];
        
                const firstX = parseInt(firstButtonInteraction.customId.split('-')[1]);
                const firstY = parseInt(firstButtonInteraction.customId.split('-')[2]);
        
                if (firstEmoji === secondEmoji) {
                    buttonRow.components[x].setStyle(ButtonStyle.Success);
                    buttonRows[firstY].components[firstX].setStyle(ButtonStyle.Success);
                } else {
                    user = false
                    setTimeout(async () => {
                        buttonRow.components[x].setEmoji(emoji.joker).setStyle(ButtonStyle.Primary).setDisabled(false);
                        buttonRows[firstY].components[firstX].setEmoji(emoji.joker).setStyle(ButtonStyle.Primary).setDisabled(false);
                        interaction.message?.edit({ components: buttonRows }).then(() => user = true).catch(() => { });
                    }, 1500);
                }
                firstButtonInteraction = null;
         }
    
         	await interaction.update({ components: buttonRows });

         	const allPairsMatched = buttonRows.every(row => row.components.every(button => button.data.style === ButtonStyle.Success));
         	if (allPairsMatched) {
                clearInterval(intervalId);
                timer = false;
                
                const timestamp = dificuldade[dif] - tempoRestante;
                
                const minutos = ~~(timestamp / 60000);
                const segundos = ((timestamp % 60000) / 1000).toFixed(0);
                const mens = minutos === 0 ? `${segundos}s` : `${minutos}min e ${segundos}s`
                
				await interaction.message.edit({ content: `Você é uma estrela brilhante! 💫 Todos os emojis combinados são seus ${emoji.rico}, e você venceu o jogo com estilo! Seu tempo para a vitória foi de apenas (\`${mens}\`)!`, components: [], ephemeral: true });
         	}
        });        

        collector.on('end', (_, reason) => {
            if (reason === 'time') {
                clearInterval(intervalId);
                timer = false
                reply?.edit({ content: `${emoji.dec} **|** O tempo voou mais rápido do que o Flash! Você está fora de tempo! ⌛🏃‍`, components: [] }).catch(() => { });
            }
        });
}; 

export default subCommandMemoryGame;
