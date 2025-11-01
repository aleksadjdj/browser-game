// src/models/map.js
import mongoose from 'mongoose';
import Entity  from './baseEntity.js';

// Extend with new fields
const entityNPCSchema  = new mongoose.Schema({
  
});

export const EntityNPC = Entity.discriminator('EntityNPC', entityNPCSchema );