import mongoose from 'mongoose';

const tileSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true
  },
  displayName: {
    type: String,
    required: true
  },
  textureUrl: {
    type: String,
    required: true
  },
  walkable: {
    type: Boolean,
    required: true,
    default: true
  },
  costWalkPoints: {
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
