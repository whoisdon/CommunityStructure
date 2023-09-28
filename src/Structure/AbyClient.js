import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Client } from 'discord.js';

import emojis from "../Config/Emojis.json" assert { type: "json" };
import log from '../Utils/Functions/getColors.js';

import { QuickDB } from 'quick.db';
const db = new QuickDB({ filePath: './src/Database/SQLite/.sqlitedata' });

const searchFile = './src/Utils/.cache/.commandsCache.json';

import readline from 'readline';
import { exec } from 'child_process';

import mysql from '../Database/SQL/MySQL.js';

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
  
    const existingCommands = this.application.commands.cache;
    const globalCommands = this.SlashCommandArray.filter(command => !command.guildCollection?.length);
    const commandsInLocalScope = this.SlashCommandArray.filter(command => command.guildCollection).map(command => Object.assign(command, command.data));
  
    const filterLocalCommands = commandsInLocalScope.filter(local => !existingCommands.some(cache => cache.name === local.name));
    const booleanLocalCommands = this.cacheCommands(filterLocalCommands, false); 
  
    const filterGlobalCommands = globalCommands.filter(global => !existingCommands.some(cache => cache.name === global.name));
    const booleanGlobalCommands = this.cacheCommands(filterGlobalCommands, true);
  
    if (!booleanLocalCommands && !booleanGlobalCommands) {
      this.log('Não há comandos para carregar. Nenhuma alteração foi efetuada!', 'cache');
      return;
    }

    else if (booleanGlobalCommands) {
      await this.application.commands.set(globalCommands).catch((err) => this.log(err, 'error'));
      this.log('Os comandos (/) com scopo globais da aplicação foram carregados com sucesso!', 'client');
    }

    else if (booleanLocalCommands) {
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
    }
  
    this.log('Os comandos (/) com scopo globais da aplicação foram carregados com sucesso!', 'client');
  }  
  
  async getSlashCommands(path = 'src/SlashCommands') {
    const categories = readdirSync(path);
  
    for (const category of categories) {
      const commands = readdirSync(`${path}/${category}`);
  
      for (const command of commands) {
        const commandFile = join(process.cwd(), `${path}/${category}/${command}`);
        const { default: SlashCommands } = await import('file://' + commandFile);
        const cmd = new SlashCommands(this);

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

  cacheCommands(commands, isGlobal) {
    let cacheData = JSON.parse(readFileSync(searchFile, 'utf-8'));
    let hasChanges = false;
  
    const cacheObjectName = isGlobal ? 'globalCommandsCache' : 'localCommandsCache';
    const cacheObject = cacheData[cacheObjectName] || {};
  
    for (const name in cacheObject) {
      if (!commands.some(command => command.name === name)) {
        delete cacheObject[name];
        hasChanges = true;
      }
    }
  
    for (const command of commands) {
      const name = command.name;
      const json = JSON.stringify(command, null, 2);
  
      if (!cacheObject.hasOwnProperty(name) || cacheObject[name] !== json) {
        cacheObject[name] = json;
        hasChanges = true;
      }
    }
  
    cacheData[cacheObjectName] = cacheObject;
  
    writeFileSync(searchFile, JSON.stringify(cacheData, null, 2), 'utf8');
  
    return hasChanges;
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
