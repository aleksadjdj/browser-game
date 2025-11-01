//src\models\baseEntity.js
import mongoose from 'mongoose';

const entitySchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true
  },
  mapSlug: {
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
  }
});

const Entity = mongoose.model('Entity', entitySchema);
export default Entity;