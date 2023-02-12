const fs = require('fs');
const utils = { functions: require('../Utils/functions') };
const { join } = require('path');
const { Client } = require('discord.js');

module.exports = class extends Client {
  constructor(options) {
    super(options);

    this.commandSlash = [];
    this.loadCommands();
    this.loadEvents();
    this.cooldown = new Set();
    this.moment = require('moment');
    this.utils = utils.functions;
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

  loadCommands(path = 'src/Commands') {
    const categories = fs.readdirSync(path);
    for (const category of categories) {
      const commands = fs.readdirSync(`${path}/${category}`);

      for (const command of commands) {
        const commandClass = require(join(process.cwd(), `${path}/${category}/${command}`));
        const cmd = new commandClass(this);

        this.commandSlash.push(cmd);
      }
    }
  }

  loadEvents(path = 'src/Events') {
    const eventsFolders = fs.readdirSync(path);
    for (const folders of eventsFolders) {
      const eventsFiles = fs.readdirSync(`${path}/${folders}`);
      for (const files of eventsFiles) {
        if (!files.endsWith('.js')) return;
        const eventClass = require(join(process.cwd(), `${path}/${folders}/${files}`));

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
      const { connect } = require('mongoose');
      const mongoose = require('mongoose');
      const Models = require('../Database/Models');

      mongoose.set('strictQuery', true);

      await this.utils.logger('Conectando com a database...', 'mongoose');
      const connection = connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      this.db = {
        connection,
        ...Models,
      };

      await this.utils.logger('Database carregada com sucesso', 'mongoose');
    } catch (error) {
      await this.utils.logger(
        'Ocorreu um erro ao tentar conectar com a database\n' + error,
        'mongoose'
      );
    }
  }
};
