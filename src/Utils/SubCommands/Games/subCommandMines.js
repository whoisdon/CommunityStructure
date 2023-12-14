import { ActionRowBuilder, ButtonStyle, ButtonBuilder } from 'discord.js';

const subCommandMines = async ({ interaction, emoji }) => {
    const option = interaction.options.getString('bombas') ?? 2;

    let boardSize = 5;
    let numberOfBombs = parseInt(option);
    
    if (option === 'cell_2') {
        boardSize = 4;
        numberOfBombs = 2;
    }
    
    const bombPositions = [];

    while (bombPositions.length < numberOfBombs) {
        const x = ~~(Math.random() * boardSize);
        const y = ~~(Math.random() * boardSize);

        const position = `${x}-${y}`;

        if (!bombPositions.includes(position)) {
            bombPositions.push(position);
        }
    }

    const buttons = [];

    for (let y = 0; y < boardSize; y++) {
        const row = [];

        for (let x = 0; x < boardSize; x++) {
            const isBomb = bombPositions.includes(`${x}-${y}`);

            const button = new ButtonBuilder()
                .setCustomId(`${interaction.user.id}-${x}-${y}`) 
                .setLabel('❓')
                .setStyle(ButtonStyle.Secondary);

            row.push(button);
        }

        buttons.push(row);
    }

    const buttonRows = buttons.map(row => new ActionRowBuilder().addComponents(...row));

    const reply = await interaction.reply({
        content: 'Campo Minado!',
        components: buttonRows,
        fetchReply: true
    });

    const totalDiamonds = (boardSize * boardSize) - numberOfBombs;
    let diamondsDiscovered = 0;
    
    const filter = (i) => {
        if (i.user.id !== interaction.user.id) {
            i?.reply({ content: `${emoji.under} **|** ${i.user} apenas ${interaction.user} pode interagir com os botões!`, ephemeral: true }).catch(() => { });
            return false;
        }
        return true;
	};
    
    const collector = reply.createMessageComponentCollector({ filter, time: 60000 });

    collector.on('collect', async (interaction) => {
        const [_, x, y] = interaction.customId.split('-').map(Number);
        const isBomb = bombPositions.includes(`${x}-${y}`);
        
        // const content = isBomb ? `Kaboom! ${emoji.kabum} Parece que você encontrou uma bomba! O jogo foi pelos ares.` : `${emoji.gddiamond} | Eureka! Um diamante brilhante atravessa seu caminho! Brilhe como um verdadeiro aventureiro!`;
       const content = isBomb 
  ? `Kaboom! ${emoji.kabum} Parece que você encontrou uma bomba! O jogo foi pelos ares.` 
  : diamondsDiscovered + 1 === 0 
    ? `${emoji.gddiamond} | Eureka! Um diamante brilhante atravessa seu caminho! Brilhe como um verdadeiro aventureiro!`
    : `${emoji.gddiamond} | Ei, você é como o Indiana Jones dos diamantes! Um? Dois? Três? Não pare agora, você está em uma mina de tesouros! (${diamondsDiscovered + 1 > 1 ? `\`${diamondsDiscovered + 1}\` Diamantes encontrados` : `\`${diamondsDiscovered + 1}\` Diamante encontrado`})`;
        
        const newButton = new ButtonBuilder()
            .setCustomId(interaction.customId)
            .setEmoji(isBomb ? emoji.gbomb : emoji.gddiamond)
            .setStyle(isBomb ? ButtonStyle.Danger : ButtonStyle.Primary) 
            .setDisabled(true);

        const rowIndex = y;
        const row = [...buttonRows[rowIndex].components];
        row[x] = newButton;

        buttonRows[rowIndex] = new ActionRowBuilder().addComponents(...row);

        await interaction?.update({ content, components: buttonRows }).catch(() => { });

        if (isBomb) {
            buttonRows.forEach(row =>
                row.components.forEach(button => button.setDisabled(true))
            );
        
            await interaction.message.edit({ content, components: buttonRows });
            collector.stop();
        } else {
            diamondsDiscovered++;

            if (diamondsDiscovered === totalDiamonds) {
                await interaction.editReply({ content: `Você é uma estrela brilhante! Todos os diamantes são seus ${emoji.rico}, e você venceu o jogo com estilo!`, components: [] });
                collector.stop();
            }
        }
    });

    collector.on('end', (_, reason) => {
        if (reason === 'time') {
            reply?.edit({ content: `${emoji.dec} **|** O tempo voou mais rápido do que o Flash! Você está fora de tempo! ⌛🏃‍`, components: [] }).catch(() => { });
        }
    });
}

export default subCommandMines;
