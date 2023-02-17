import { readdirSync } from 'fs';
import { join } from 'path';
import { Client } from 'discord.js';
import { connect, set } from 'mongoose';
import Models from '../Database/Models.js';
const functions = import('../Utils/functions.js');

export default class extends Client {
    constructor(options) {
    super(options);

    this.commandSlash = [];
    this.loadUtils();
    this.loadCommands();
    this.loadEvents();
    this.utils = functions;
    this.cooldown = new Set();
    this.moment = import('moment');
  }

  async loadUtils() {
    this.utils = await functions;
  }

  registerCommands() {
    this.utils.logger('Carregando os comandos (/) da aplicação', 'commands');
    this.application?.commands
      .set(this.commandSlash)
      .then(() => {
        this.utils.logger('Os comandos (/) da aplicação foram carregados com sucesso.', 'commands');
      })
      .catch((err) => {
        this.utils.logger(err, 'error');
      });
  }

  async loadCommands(path = 'src/Commands') {
    const categories = readdirSync(path);
    for (const category of categories) {
      const commands = readdirSync(`${path}/${category}`);

      for (const command of commands) {
        const commandFile = join(process.cwd(), `${path}/${category}/${command}`);
        const { default: CommandClass } = await import(commandFile);
        const cmd = new CommandClass(this);
        
        this.commandSlash.push(cmd);
      }
    }
  }

  async loadEvents(path = 'src/Events') {
    const eventsFolders = readdirSync(path);
    for (const folders of eventsFolders) {
      const eventsFiles = readdirSync(`${path}/${folders}`);
      for (const files of eventsFiles) {
        if (!files.endsWith('.js')) return;
        const eventFile = join(process.cwd(), `${path}/${folders}/${files}`);
        const { default: eventClass } = await import(eventFile);
        const evnt = new eventClass(this);
        if (!evnt.once) {
           this.on(evnt.name, evnt.run);
        } else {
           this.once(evnt.name, evnt.run);
        }
      }
    }
  }

    async connectToDatabase() {
    try {
        set('strictQuery', true);

        console.log('Conectando com a database...');
        const connection = await connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        });

        const db = {
        connection,
        ...Models,
        };

        console.log('Database carregada com sucesso');
        return db;
    } catch (error) {
        console.error(`Ocorreu um erro ao tentar conectar com a database\n${error}`);
        return null;
    }
  }  
};
