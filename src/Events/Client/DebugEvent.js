import EventMap from '../../Structure/EventMap.js';

export default class extends EventMap {
  constructor(client) {
    super(client, {
      name: 'debug'
    });
  }
  run = (info) => {
     // console.log(info)
  }
}
