class Command {
  constructor(client, options) {
    this.client = client;
    this.name = options.name || options.data?.name;
    this.description = options.description || options.data?.description;
    this.options = options.options || options.data?.options;
    this.permissions = options.permissions;
    this.onlyDevs = options.onlyDevs;
    this.defer = options.defer || true;
  }
}

export default Command;
