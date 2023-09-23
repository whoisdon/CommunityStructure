import EventMap from '../../Structure/EventMap.js';
import axios from 'axios';
import { writeFileSync } from 'fs';

export default class extends EventMap {
  constructor(client) {
    super(client, {
      name: 'ready',
      once: true
    });
  }
  run = () => {
    setInterval(async () => {
        axios.get('https://wandbox.org/api/list.json').then((response) => {
            writeFileSync(process.cwd() + '/src/Utils/.cache/.runtimesCache.json', JSON.stringify(response.data));
        }).catch(() => { })
    }, 20 * 60000)
  };
};
