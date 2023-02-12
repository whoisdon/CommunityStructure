class Command {
  constructor(client, options) {
    this.client = client;
    this.name = options.name;
    this.description = options.description;
    this.options = options.options;
    this.permissions = options.permissions;
    this.onlyDevs = options.onlyDevs;
    this.defer = options.defer || true;
  }
}

module.exports = Command;
