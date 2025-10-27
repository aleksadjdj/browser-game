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
  texture: {
    type: String,
    required: true
  },
  walkable: {
    type: Boolean,
    required: true,
    default: true
  },
  cost_walk_points: {
    type: Number,
    required: true,
    default: 1
  },
  liquid: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model('Tile', tileSchema);
