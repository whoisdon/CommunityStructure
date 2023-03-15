class Event {
  constructor(client, options) {
    this.client = client;
    this.name = options.name;
    this.once = options.once || false;
  }
}

export default Event;
