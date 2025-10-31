// src/models/map.js
import mongoose from 'mongoose';
import { Entity } from './baseEntity.js';

// Extend with new fields
const entityPortalSchema  = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true
  },
  displayName: {
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
	destMapSlug: { 
		type: String, 
		required: true,
		default: 'ashen_peaks' 
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
  }

});

export const EntityPortal = Entity.discriminator('EntityPortal', entityPortalSchema );