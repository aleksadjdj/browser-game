// src/models/map.js
import mongoose from 'mongoose';

// Extend with new fields
const entityPortal = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true
  },
  displayName: {
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
  interactable: { 
    type: Boolean, 
    default: true 
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
	destMapName: { 
		type: String, 
		required: true,
		default: 'thornwood' 
	},
  destX: { 
    type: Number, 
    required: true,
    default: 1
  },
	destY: { 
    type: Number, 
    required: true,
    default: 1
  },
});

export default mongoose.model('EntityPortal', entityPortal);