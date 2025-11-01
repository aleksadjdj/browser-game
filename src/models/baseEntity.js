//src\models\baseEntity.js
import mongoose from 'mongoose';

const entitySchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    // not unique in this case
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
  },
  x: { 
    type: Number, 
    required: true,
    default: 0
  },
  y: { 
    type: Number, 
    required: true,
    default: 0
  },
});

const Entity = mongoose.model('Entity', entitySchema);
export default Entity;