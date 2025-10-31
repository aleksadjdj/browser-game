import mongoose from 'mongoose';

const entitySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
	type: {
    type: String,
    required: true
  },
  texture: {
    type: String,
    required: true
  },
  properties: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  }
});

export default mongoose.model('Entity', entitySchema);
