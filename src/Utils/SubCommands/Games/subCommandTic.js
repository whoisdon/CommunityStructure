import { ActionRowBuilder, ButtonStyle, ButtonBuilder } from 'discord.js';

const subCommandTic = async ({ interaction, emoji, quickdb }) => {
    const member = interaction.options.getMember('multiplayer')
    const dif = interaction.options.getString('dificuldade')

    const boardSize = 3;
    const buttons = Array.from({
            length: boardSize
        }, (_, y) =>
            Array.from({
                length: boardSize
            }, (_, x) =>
            new ButtonBuilder()
            .setCustomId(`velha-${interaction.user.id}-${x}-${y}`)
            .setStyle(ButtonStyle.Secondary)
            .setLabel('⠀')
            .setDisabled(false)
            )
    );
    
    const buttonRows = buttons.map(row => new ActionRowBuilder().addComponents(...row));

    const winningCombinations = [
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]]
    ];

    const filter = (i) => {
        if (i.user.id === interaction.user.id || i.user.id === member.user.id) {
            return true;
        }
        const users = member ? `${i.user} apenas ${interaction.user} e ${member.user} podem`  : `${i.user} apenas ${interaction.user} pode`
        i?.reply({ content: `${emoji.under} **|** ${users} interagir com os botões!`, ephemeral: true }).catch(() => { });
        return false;
    };

    const checkWinner = (buttons, buttonLabel) => {
        return winningCombinations.some(combination =>
            combination.every(([x, y]) => buttons[y][x].data.label === buttonLabel)
        );
    };

    if (member) {
        if (member.user.bot) {
            interaction.reply({ content: `${emoji.under} **|** Parece que você está tentando fazer um bot se divertir. Bots não podem participar disso!`, ephemeral: true });
            return;
        }        

        else if (interaction.user === member.user) {
            interaction.reply({ content: `${emoji.under} **|** Parece que você está tentando fazer algo consigo mesmo. Você é incrível, mas não pode fazer isso com você!`, ephemeral: true });
            return;
        }        

        const message = await interaction.reply({ content: `🎮 Ei, ${member}! Que tal uma batalha épica no campo de jogo mais estratégico de todos os tempos? É hora de colocar nossas habilidades à prova no **JOGO DA VELHA**!
👉 Você foi desafiado por ${interaction.user}, o mestre dos triunfos no jogo da velha. Será que você está à altura do desafio?
Quando você estiver pronto para a batalha, clique no ✅, e o jogo começará! Que vença o melhor estrategista! 🏆😄`, fetchReply: true })
        await message.react('✅');

        const collector = message.createReactionCollector({ filter: (_, user) => user.id === member?.user.id });
        const players = [member.user.id, interaction.user.id];
        let currentPlayerIndex = 0;
        let currentSymbol = 'X';

        collector.on('collect', async (reaction, user) => {
            if (reaction.emoji.name !== '✅') return;

            message.reactions.removeAll();
            await message.edit({ content: `Jogo da Velha! O usuário desafiado começa ${member.user}!`, components: buttonRows });

            const collector = message.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async int => {
                const [, userId, x, y] = int.customId.split('-');
                const xAsNumber = parseInt(x);
                const yAsNumber = parseInt(y);

                const selectedButton = buttons[yAsNumber][xAsNumber];
                const currentPlayerId = players[currentPlayerIndex];

                if (int.user.id !== currentPlayerId) {
                    const otherPlayerId = players[currentPlayerIndex];
                    await int.reply({ content: `${emoji.dec} **|** Segura aí, Flash! Não vai rolar uma corridinha até o(a) <@${otherPlayerId}> conseguir jogar?`, ephemeral: true });
                    return;
                }                

                else if (selectedButton && !selectedButton.disabled) {
                    selectedButton.setLabel(currentSymbol).setStyle(currentSymbol === 'X' ? ButtonStyle.Primary : ButtonStyle.Danger).setDisabled(true);
                    buttonRows[yAsNumber].components[xAsNumber] = selectedButton;
                    
                    currentPlayerIndex = 1 - currentPlayerIndex;
                    currentSymbol = currentSymbol === 'X' ? 'O' : 'X'; 
                    int.update({
                        content: `Jogo da Velha! Agora é a vez do(a) incrível <@${players[currentPlayerIndex]}>!`,
                        components: buttonRows
                    }).then(async () => {   
                        const otherPlayerId = players[currentPlayerIndex];
                        const isBoardFull = buttons.every(row => row.every(button => button.data.disabled));

                        if (checkWinner(buttons, 'X')) {
                            await interaction.editReply({
                                content: `Surpreendente! ${emoji.juiz} O Desafiado acabou de vencer no jogo da velha de <@${players[1]}>! ❌ Quem teria pensado que as cruzes sairiam vitoriosas? 🎉 Você é o mestre das cruzes! Parabéns pela vitória merecida. 🏆 Desafie alguém novamente e veja se você pode repetir o feito!`,
                                components: []
                            });
                            collector.stop();
                            return;
                        }
        
                        else if (checkWinner(buttons, 'O')) {
                            await interaction.editReply({
                                content: `Parabéns, Desafiador! 🏆 Você mostrou sua destreza estratégica e ganhou no jogo da velha de <@${players[0]}>! 🟡 Você é o grande campeão das bolinhas! 🎉 Prepare-se para receber os louros da vitória e continue desafiando o mundo`,
                                components: []
                            });
                            collector.stop();
                            return;
                        }

                        else if (isBoardFull) {
                            await interaction.editReply({
                                content: `${emoji.juiz} **|** É um empate! O jogo terminou sem um vencedor.`,
                                components: []
                            });
                            collector.stop();
                            return;
                        }
                    });                
                }          
            });
        });
    }

    else if (!member) {
        var user = true;
    
        const reply = await interaction.reply({
            content: 'Jogo da Velha!',
            components: buttonRows,
            fetchReply: true
        });
    
        const filter = (i) => {
            if (i.user.id !== interaction.user.id) {
                i?.reply({ content: `${emoji.under} **|** ${i.user} apenas ${interaction.user} pode interagir com os botões!`, ephemeral: true }).catch(() => { });
                return false;
            }
            return true;
        };
        const collector = reply.createMessageComponentCollector({ filter, time: 60000 });
        
        const randomMove = (buttons) => {
            const availableMoves = [];
        
            buttons.forEach((row, y) =>
                row.forEach((button, x) => {
                    if (button.data.label === '⠀') {
                        availableMoves.push({ x, y });
                    }
                })
            );
        
            if (availableMoves.length > 0) {
                const randomIndex = Math.floor(Math.random() * availableMoves.length);
                return availableMoves[randomIndex];
            } else {
                return { x: -1, y: -1 };
            }
        };
    
        const minimax = (buttons, depth, isMaximizing) => {
            const aiWin = checkWinner(buttons, 'O');
            const playerWin = checkWinner(buttons, 'X');
    
            if (aiWin) return 10 - depth;
            if (playerWin) return depth - 10;
            if (!buttons.flat().some(button => button.data.label === '⠀')) return 0;
    
            const evalFunction = isMaximizing ? Math.max : Math.min;
            let evalValue = isMaximizing ? -Infinity : Infinity;
    
            for (let y = 0; y < boardSize; y++) {
                for (let x = 0; x < boardSize; x++) {
                    if (buttons[y][x].data.label === '⠀') {
                        buttons[y][x].setLabel(isMaximizing ? 'O' : 'X');
                        const ev = minimax(buttons, depth + 1, !isMaximizing);
                        buttons[y][x].setLabel('⠀');
                        evalValue = evalFunction(evalValue, ev);
                    }
                }
            }
            return evalValue;
        };
    
        const averageMove = (buttons) => {
            for (let y = 0; y < boardSize; y++) {
                for (let x = 0; x < boardSize; x++) {
                    if (buttons[y][x].data.label === '⠀') {
                        buttons[y][x].setLabel('O');
                        if (checkWinner(buttons, 'O')) {
                            buttons[y][x].setLabel('⠀');
                            return { x, y };
                        }
                        buttons[y][x].setLabel('⠀');
                    }
                }
            }
    
            for (let y = 0; y < boardSize; y++) {
                for (let x = 0; x < boardSize; x++) {
                    if (buttons[y][x].data.label === '⠀') {
                        buttons[y][x].setLabel('X');
                        if (checkWinner(buttons, 'X')) {
                            buttons[y][x].setLabel('O');
                            return { x, y };
                        }
                        buttons[y][x].setLabel('⠀');
                    }
                }
            }
    
            return randomMove(buttons);
        };
        
        const hardMove = (buttons) => {
            for (let y = 0; y < boardSize; y++) {
                for (let x = 0; x < boardSize; x++) {
                    if (buttons[y][x].data.label === '⠀') {
                        buttons[y][x].setLabel('O');
                        if (checkWinner(buttons, 'O')) {
                            buttons[y][x].setLabel('⠀');
                            return { x, y };
                        }
                        buttons[y][x].setLabel('⠀');
                    }
                }
            }
    
            for (let y = 0; y < boardSize; y++) {
                for (let x = 0; x < boardSize; x++) {
                    if (buttons[y][x].data.label === '⠀') {
                        buttons[y][x].setLabel('X');
                        if (checkWinner(buttons, 'X')) {
                            buttons[y][x].setLabel('O');
                            return { x, y };
                        }
                        buttons[y][x].setLabel('⠀');
                    }
                }
            }
    
            const possibleMoves = [];
            for (let y = 0; y < boardSize; y++) {
                for (let x = 0; x < boardSize; x++) {
                    if (buttons[y][x].data.label === '⠀') {
                        buttons[y][x].setLabel('O');
                        const score = minimax(buttons, 0, false);
                        buttons[y][x].setLabel('⠀');
                        possibleMoves.push({ x, y, score });
                    }
                }
            }
            possibleMoves.sort((moveA, moveB) => moveB.score - moveA.score);
            return possibleMoves[0] || randomMove(buttons);
        };
    
        const impossibleMode = (buttons, learnedMoves) => {
            let bestScore = -Infinity;
            let bestMove = {
                x: -1,
                y: -1
            };
            let hasValidMove = false;
    
            buttons.forEach((row, y) => {
                row.forEach((button, x) => {           
                    if (button.data.label === '⠀') {
                        button.setLabel('O');
                        const score = minimax(buttons, 0, false);
                        button.setLabel('⠀');
    
                        const moveKey = `${x}-${y}`;
                        if (score > bestScore && !learnedMoves.includes(moveKey)) {
                            [bestScore, bestMove] = [score, { x, y }];
                        }
    
                        hasValidMove = true;
                    }
                });
            });
    
            return hasValidMove ? bestMove : { x: -1, y: -1 };
        };
    
        const storeMatchData = async (data) => {
            const allData = await quickdb.get('match_data') || [];
            allData.push(data);
    
            await quickdb.set('match_data', allData);
        }
    
        const bestMove = (buttons, difficulty) => {      
          if (difficulty === 'easy') {
            return randomMove(buttons);
          }
           
          else if (difficulty === 'hard') {
              return hardMove(buttons);
          }
           
          else if (difficulty === 'impossible') {
              const learnedMoves = [];
              return impossibleMode(buttons, learnedMoves);
          }
           
          return averageMove(buttons);
        };
    
        collector.on('collect', async interaction => {
            const [, userId, x, y] = interaction.customId.split('-');
            const xAsNumber = parseInt(x);
            const yAsNumber = parseInt(y);
    
            const selectedButton = buttons[yAsNumber][xAsNumber];
            
            if (!user) {
                await interaction.reply({ content: `${emoji.dec} **|** Segura aí, Flash! Não vai rolar uma corridinha até eu consequir jogar?`, ephemeral: true })
                return;
            }
    
            if (selectedButton && !selectedButton.disabled) {
                user = false;
                selectedButton.setLabel('X').setStyle(ButtonStyle.Primary).setDisabled(true);
                buttonRows[yAsNumber].components[xAsNumber] = selectedButton;
                await interaction.update({
                    components: buttonRows
                });
    
                if (checkWinner(buttons, 'X')) {
                   const losingMoves = [];
    
                    buttons.forEach((row, y) => {
                        row.forEach((button, x) => {
                            if (button.data.label === '⠀') {
                                const moveKey = `${x}-${y}`;
                                losingMoves.push(moveKey);
                            }
                        });
                    });
    
                    await storeMatchData({ moves: losingMoves, result: 'loss' });
                    
                    await interaction.editReply({
                        content: `${emoji.fuc} **|** Oh não, parece que perdi. Parabéns a você por vencer!`,
                        components: []
                    });
                    collector.stop();
                    return;
                }
    
                buttons.flat().map(button => button.setDisabled(true));
                await interaction.message.edit({
                    components: buttonRows
                }).catch(() => {});
    
                setTimeout(async () => {
                    const aiMove = bestMove(buttons, dif);
    
                    if (aiMove.x === -1 && aiMove.y === -1) {
                        await interaction.editReply({
                            content: `${emoji.juiz} **|** É um empate! O jogo terminou sem um vencedor.`,
                            components: []
                        });
                        collector.stop();
                        return;
                    }
    
                    buttons[aiMove.y][aiMove.x].setLabel('O').setStyle(ButtonStyle.Danger).setDisabled(true);
                    buttonRows[aiMove.y].components[aiMove.x] = buttons[aiMove.y][aiMove.x];
    
                    await interaction.message.edit({
                        components: buttonRows
                    }).catch(() => {});
    
                    if (checkWinner(buttons, 'O')) {
                        await interaction.editReply({
                            content: `${emoji.win} **|** Eu ganhei! Que tal jogar novamente?`,
                            components: []
                        });
                        collector.stop();
                        return;
                    }
    
                    const updatedButtonRows = buttons.map((row) => {
                        const newRow = new ActionRowBuilder();
                        row.map((button) => {
                            if (button.data.label === '⠀') {
                                newRow.addComponents(button.setDisabled(false));
                            } else {
                                newRow.addComponents(button.setDisabled(true));
                            }
                        });
                        return newRow;
                    });
                    await interaction.message.edit({
                        components: updatedButtonRows
                    }).then(() => user = true).catch(() => {});
                }, 1000);
            }
        });
    
        collector.on('end', (_, reason) => {
            if (reason === 'time') {
                reply?.edit({
                    content: `${emoji.dec} **|** O tempo voou mais rápido do que o Flash! Você está fora de tempo! ⌛🏃‍`,
                    components: []
                }).catch(() => {});
            }
        });
    }
}

export default subCommandTic;
