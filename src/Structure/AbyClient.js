import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Client } from 'discord.js';

import emojis from "../Config/Emojis.json" assert { type: "json" };
import log from '../Utils/Functions/getColors.js';

import { QuickDB } from 'quick.db';
const db = new QuickDB({ filePath: './src/Database/SQLite/.sqlitedata' });

import readline from 'readline';
import { exec } from 'child_process';

import cache from '../Utils/.cache/.commandsCache.json' assert { type: "json" };
import mysql from '../Database/SQL/MySQL.js';

const fileCommandsName = [];
const isNotModified = [];

const searchFile = './src/Utils/.cache/.commandsCache.json';

export default class extends Client {
    constructor(options) {
        super(options);

        (async () => {
            this.SlashCommandArray = [];
            this.PrefixCommandArray = [];
            this.dockerShell();
            this.getPrefixCommands();
            this.getSlashCommands();
            this.getEvents();
            this.cooldown = new Set();
            this.log = log;
            this.emoji = emojis;
            this.quickdb = db;
            this.mysql = await mysql;
        })();
  }

  async registerCommands() {
      this.log('Aguarde enquanto a aplicação carrega os comandos (/)...', 'system');

      const cacheKeys = Object.keys(cache);
      const existingCommands = await this.application.commands.fetch();
      const globalCommands = this.SlashCommandArray.filter(command => !command.guildCollection?.length);
      const commandsInLocalScope = this.SlashCommandArray.filter(command => command.guildCollection).map(command => Object.assign(command, command.data));

      const allCommands = [...existingCommands, ...globalCommands];
      const commandNames = allCommands.map(command => command.name);

      const differentItems = cacheKeys.filter(key => !commandNames.includes(key));

      const array1 = globalCommands.map(command => command.name).sort().join(',');
      const array2 = fileCommandsName.filter(commandName => globalCommands.some(command => command.name === commandName)).sort().join(',');
      
      this.removeObjectFromJSONFile(differentItems);

      if (differentItems.length === 0 && array1 === array2) {
        this.log('Não há comandos para carregar. Nenhuma alteração foi efetuada!', 'cache');
        return;
      } else {
        for (const guildID of commandsInLocalScope.flatMap(command => command.guildCollection)) {
          const commands = commandsInLocalScope.filter(
            cmd => cmd.guildCollection.includes(guildID)
          );

          const guild = this.guilds.cache.get(guildID);
          if (!guild) {
            this.log(`O servidor ${guild.name} (${guild.id}) está fora do cache do client`, 'error');
            continue;
          }

          await guild.commands.set(commands).catch((err) => this.log(err, 'error'));

          this.log(`Os comandos (/) com scopo local da aplicação foram carregados com sucesso na guild: ${guild.name} (${guild.id})!`, 'client');
        }

        await this.application.commands.set(globalCommands).catch((err) => this.log(err, 'error'));
        this.log('Os comandos (/) com scopo globais da aplicação foram carregados com sucesso!', 'client');
      }
}
  
  async getSlashCommands(path = 'src/SlashCommands') {
    const categories = readdirSync(path);
  
    for (const category of categories) {
      const commands = readdirSync(`${path}/${category}`);
  
      for (const command of commands) {
        const commandFile = join(process.cwd(), `${path}/${category}/${command}`);
        const { default: SlashCommands } = await import('file://' + commandFile);
        const cmd = new SlashCommands(this);

        const isModified = this.cacheCommands(cmd);
        
        isNotModified.push(!isModified);
        fileCommandsName.push(cmd?.name);

        this.SlashCommandArray.push(cmd);
      }
    }
  }

  async getPrefixCommands(path = 'src/PrefixCommands') {
    const categories = readdirSync(path);
    for (const category of categories) {
      const commands = readdirSync(`${path}/${category}`);

      for (const command of commands) {
        const commandFile = join(process.cwd(), `${path}/${category}/${command}`);
        const { default: PrefixCommands } = await import('file://' + commandFile);
        const cmd = new PrefixCommands(this);
        
        this.PrefixCommandArray.push(cmd);
      }
    }
  }

  async getEvents(path = 'src/Events') {
    const eventsFolders = readdirSync(path);
    for (const folders of eventsFolders) {
      const eventsFiles = readdirSync(`${path}/${folders}`);
      for (const files of eventsFiles) {
        if (!files.endsWith('.js')) return;
        const eventFile = join(process.cwd(), `${path}/${folders}/${files}`);
        const { default: EventMap } = await import('file://' + eventFile);
        const evnt = new EventMap(this);
        if (!evnt.once) {
           this.on(evnt.name, evnt.run);
        } else {
           this.once(evnt.name, evnt.run);
        }
      }
    }
  }

   cacheCommands(cmd) {
     const data = cmd.toJSON();

     const name = data?.name;
     const cacheData = JSON.parse(readFileSync(searchFile, 'utf-8'));
     const existObj = cacheData.hasOwnProperty(name);
    
     const json = JSON.stringify(cmd, null, 2);
     const fileUpdate = { ...cacheData, [name]: json };
    
     writeFileSync(searchFile, JSON.stringify(fileUpdate, null, 2), 'utf8');
    
     const response = !existObj || cacheData[name] !== json;

     return response;
   }
  
   removeObjectFromJSONFile(objectToRemove) {
     const data = readFileSync(searchFile, 'utf8');

     const json = JSON.parse(data);
     objectToRemove.forEach(key => delete json[key]);

     const updatedJson = JSON.stringify(json, null, 2);
     writeFileSync(searchFile, updatedJson, 'utf8')
   }

  antiCrash() {
    process.on("uncaughtException", (err, origin) => {
      console.log(chalk.gray("—————————————————————————————————"));
      console.log(
         chalk.white("["),
         chalk.red.bold("AntiCrash"),
         chalk.white("]"),
         chalk.gray(" : "),
         chalk.white.bold("Uncaught Exception/Catch")
      );
      console.log(chalk.gray("—————————————————————————————————"));
      console.log(err, origin);
   });
  }
    
  dockerShell() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.on('line', function(data) {
      const resposta = data.trim().toLowerCase();

      exec(resposta, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing command: ${error}`);
        }
        console.log(stdout);
        console.error(stderr);
      });
    });
  }
};
