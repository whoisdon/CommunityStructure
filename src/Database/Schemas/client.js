import mongoose from 'mongoose';

const { Schema } = mongoose;

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

export default Client;
