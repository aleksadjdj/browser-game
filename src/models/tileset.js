import mongoose from 'mongoose';

const tilesetSchema = new mongoose.Schema({
  name: {
    // ashen_peaks, thornwood, winters_veil, ...etc.
    type: String,
    required: true,
    unique: true
  },
  displayName: { 
    // Ashen Peaks, Thornwood, Winter’s Veil, ...etc.
    type: String,
    required: true,
  },
  tiles: [
    {
      id: String,
      name: String,
      texture: String,
      walkable: Boolean,
      cost_walk_points: Number,
      liquid: Boolean
    }
  ]
});

export default mongoose.model('Tileset', tilesetSchema);
