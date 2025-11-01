// src\models\greetings.js
import mongoose from 'mongoose';

const greetingsSchema = new mongoose.Schema({
  npcType: {
    type: String,
    required: true
  },
  messages: {
    type: [String],
    required: true
  }
});

export default mongoose.model('Greetings', greetingsSchema);
