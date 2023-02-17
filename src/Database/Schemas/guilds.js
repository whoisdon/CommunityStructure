import mongoose from 'mongoose';

const { Schema } = mongoose;

const guildSchema = new Schema({
  _gId: {
    type: String,
  },
});

const Guild = mongoose.model('Guilds', guildSchema);

export default Guild;
