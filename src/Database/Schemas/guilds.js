const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const guildSchema = new Schema({
  _gId: {
    type: String,
  },
});

const Guild = mongoose.model('Guilds', guildSchema);
module.exports = Guild;
