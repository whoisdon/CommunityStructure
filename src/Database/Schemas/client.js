const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
  _cId: {
    type: String,
  },
  developers: {
    type: String,
    default: '', // client id
  },
});

const Client = mongoose.model('Client', clientSchema);
module.exports = Client;
