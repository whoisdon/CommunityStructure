import { API } from 'darkcord';
 
class Command {
  constructor(client, options) {
    this.client = client;
    this.name = options.name || options.data.name;
    this.description = options.description || options.data.description;
    this.options = options.options || options.data?.options;
    this.permissions = options.permissions;
    this.onlyDevs = options.onlyDevs;
    this.defer = options.defer || false;
    this.dm_permission = false;
    this.name_localizations = options.name_localizations;
    this.type = options?.type || API.ApplicationCommandType.ChatInput
  }
  
  toJSON() {
    const { client, ...data } = this;
    return data;
  }
}

export default Command;
