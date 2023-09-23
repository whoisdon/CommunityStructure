import { PermissionFlagsBits } from 'discord.js';

class PrefixCommands {
  constructor(client, options) {
    this.client = client;
    this.name = options.name;
    this.description = options?.description;
    this.aliases = options?.aliases;
    this.isPrivate = options.isPrivate;
    this.userPermissions = options.userPermissions;
    this.botPermissions = options.botPermissions || [PermissionFlagsBits.SendMessages]; // default permission, reply messages
    this.mentionCommand = options?.mentionCommand;
    this.onlyDevs = options.onlyDevs;
    this.guildCollection = options.guildCollection;
    this.emoji = this.client.emoji;
    this.log = this.client.log;
    this.quickdb = this.client.quickdb;
    this.mysql = this.client.mysql;
  }
}

export default PrefixCommands;
