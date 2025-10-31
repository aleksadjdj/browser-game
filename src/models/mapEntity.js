import mongoose from 'mongoose';

const mapEntitySchema = new mongoose.Schema({
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
  textureUrl: {
    type: String,
    required: true
  },
});

export default mongoose.model('MapEntity', mapEntitySchema);
