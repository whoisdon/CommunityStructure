import SlashCommands from '../../Structure/SlashCommands.js';
import { SlashCommandBuilder } from 'discord.js';

import subCommandMines from '../../Utils/SubCommands/Games/subCommandMines.js';
import subCommandTic from '../../Utils/SubCommands/Games/subCommandTic.js';
import subCommandMemoryGame from '../../Utils/SubCommands/Games/subCommandMemoryGame.js';
import subCommandTermo from '../../Utils/SubCommands/Games/subCommandTermo.js';

export default class extends SlashCommands {
  constructor(client) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName('start')
        .setDescription('[Game] Se divirta com jogos clássicos e divertidos.')  
        .setDMPermission(false)
        .addSubcommand(subcommand => subcommand
          .setName('tic-tac-toe')
          .setDescription('[Game] Entre no desafio do clássico jogo da velha e mostre quem manda.')
          .addStringOption(option => option 
            .setName('dificuldade')
            .setDescription('[Dificuldade] Em qual dificuldade gostaria de arriscar?')
            .setRequired(false)
            .addChoices(
              { name: 'Fácil', value: 'easy' },
              { name: 'Médio', value: 'average' },
              { name: 'Difícil', value: 'hard' },
              { name: 'Impossível', value: 'impossible' }
            )
		  )
          .addUserOption(user => user
              .setName('multiplayer')
              .setDescription('[User] Junte-se ao jogo da velha multiplayer e mostre suas habilidades estratégicas!')
          )
        )
        .addSubcommand(subcommand => subcommand
          .setName('termo')
          .setDescription('[Game] Teste seu vocabulário e mostre sua habilidade em adivinhar a palavra secreta!')
        )
        .addSubcommand(subcommand => subcommand
          .setName('memory-game')
          .setDescription('[Game] Teste sua memória e mostre sua habilidade em encontrar pares de emojis.')
          .addStringOption(option => option 
            .setName('dificuldade')
            .setDescription('[Dificuldade] Em qual dificuldade gostaria de arriscar')
            .addChoices(
              { name: 'Fácil', value: '_easy' },
              { name: 'Médio', value: '_average' },
              { name: 'Difícil', value: '_hard' }
            )
          )
        )
        .addSubcommand(subcommand => subcommand
          .setName('mines')
          .setDescription('[Game] Entre na aventura do jogo Mines e arrase colecionando todos os diamantes!')
          .addStringOption(option => option 
            .setName('bombas')
            .setDescription('[Mines] Quantas bombas serão adicionadas ao game?')
            .setRequired(false)
            .addChoices(
              { name: 'Selecionar 2 Minas', value: '2' },
              { name: 'Selecionar 3 Minas', value: '3' },
              { name: 'Selecionar 4 Minas', value: '4' },
              { name: 'Selecionar 5 Minas', value: '5' },
              { name: 'Selecionar 6 Minas', value: '6' },
              { name: 'Selecionar 7 Minas', value: '7' },
              { name: 'Selecionar 8 Minas', value: '8' },
              { name: 'Selecionar 9 Minas', value: '9' },
              { name: 'Selecionar 10 Minas', value: '10' },
              { name: 'Selecionar 11 Minas', value: '11' },
              { name: 'Selecionar 12 Minas', value: '12' },
              { name: 'Selecionar 13 Minas', value: '13' },
              { name: 'Selecionar 14 Minas', value: '14' },
              { name: 'Selecionar 15 Minas', value: '15' },
              { name: 'Selecionar 16 Minas', value: '16' },
              { name: 'Selecionar 17 Minas', value: '17' },
              { name: 'Selecionar 18 Minas', value: '18' },
              { name: 'Selecionar 19 Minas', value: '19' },
              { name: 'Selecionar 20 Minas', value: '20' },
              { name: 'Selecionar 21 Minas', value: '21' },
              { name: 'Selecionar 22 Minas', value: '22' },
              { name: 'Selecionar 23 Minas', value: '23' },
              { name: 'Selecionar 24 Minas', value: '24' },
              { name: '4x4 (2 Minas)', value: 'cell_2' },
            )
          )
        )
    });
  }

  run = async (interaction) => {
   const game = interaction.options.getSubcommand()
    
    switch (game) {
        case 'mines':
          subCommandMines({ interaction, emoji: this.emoji })
        break;
        case 'tic-tac-toe':
          subCommandTic({ interaction, emoji: this.emoji, quickdb: this.mysql }) 
        break;
        case 'memory-game':
          subCommandMemoryGame({ interaction, emoji: this.emoji })
        break;
        case 'termo':
          const termo = new subCommandTermo(this.emoji)
    	  termo.createGame(interaction)
        break;
    }
  }
}
