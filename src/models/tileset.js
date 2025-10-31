import mongoose from 'mongoose';

const tilesetSchema = new mongoose.Schema({
  mapSlug: {
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
      slug: String,
      displayName: String,
      textureUrl: String,
      walkable: Boolean,
      costWalkPoints: Number,
      liquid: Boolean
    }
  ]
});

export default mongoose.model('Tileset', tilesetSchema);
