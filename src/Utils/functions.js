const types = ['error', 'system', 'commands', 'firebase', 'mongoose', 'success', 'client'];

module.exports = {
  logger(message, type) {
    if (!type || types.indexOf(type) < 0) type = types[0];
    console.log(
      `(${
        types[types.indexOf(type)].charAt(0).toUpperCase() + types[types.indexOf(type)].slice(1)
      }) ${message}`
    );
  },

  msToDate(ms) {
    ms = Math.round(ms / 1000);
    const s = ms % 60,
      m = ~~((ms / 60) % 60),
      h = ~~((ms / 60 / 60) % 24),
      d = ~~(ms / 60 / 60 / 24);

    return `${d}d:${h}h:${m}m:${s}s`;
  },
};
