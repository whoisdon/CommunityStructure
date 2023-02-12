const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  _uId: {
    type: String,
    required: true,
  },
  _gId: {
    type: String,
  },
  warn: {
    warns: {
      type: Array,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  banClient: {
    data: {
      type: String,
    },
    banned: {
      type: Boolean,
      default: false,
    },
    reason: {
      type: String,
    },
  },
});

const User = mongoose.model('Users', userSchema);
module.exports = User;
