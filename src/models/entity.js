import mongoose from 'mongoose';

const tileSchema = new mongoose.Schema({
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
  x: {
    type: Number,
    required: true
  },
  y: {
    type: Number,
    required: true
  },
	interactable: {
		type: Boolean,
		required: true,
		default: true
	}
});

export default mongoose.model('Entity', tileSchema);
