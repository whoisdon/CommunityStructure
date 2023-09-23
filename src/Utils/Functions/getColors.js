import colors from 'colors';

const log = (message = message.replace(' ', '⠀'), type = types[0]) => {
  
  const types = ['error', 'system', 'commands', 'firebase', 'cache', 'success', 'client', 'mysql', 'notice'];

  const colorFormat = {
    error: ['[ ❌ Error ]'.bgRed, 'red'],
    system: ['[ 💻 System ]'.bgBlue, 'blue'],
    commands: ['[ 🤖 Commands ]'.bgCyan, 'cyan'],
    firebase: ['[ 🔥 Firebase ]'.bgBlue, 'blue'],
    cache: ['[ 📙 Cache ]'.bgGreen, 'green'],
    success: ['[ ✔️ Success ]'.bgGreen, 'green'],
    client: ['[ 💁 Client ]'.bgMagenta, 'magenta'],
    mysql: ['[ 🏦 MySQL ]'.gray, 'zebra'],
    notice: ['[ 🔔 Notice ]'.bgYellow + '⠀➜ '.italic.red, 'yellow']
  };

  if (!types.includes(type)) {
    type = types[0];
  }

  const [typeString, color] = colorFormat[type];

  console.log(`${typeString}⠀${colors[color](message)}`);
}

export default log;
