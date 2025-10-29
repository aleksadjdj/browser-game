// src/models/player.js
import { Schema, model } from 'mongoose';

const playerSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true // UUID or custom ID
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  lastActive: { 
    type: Date, 
    default: Date.now 
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
  fow: { 
    // field of view
    type: Number,
    required: true,
    default: 5
  },
  hp: { 
    // health points
    type: Number,
    required: true,
    default: 10
  },
  movePoints: {
    type: Number,
    required: true,
    default: 10
  },
  currentMap: {
    type: String,
    ref: 'Map', // relation to Map model
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default model('Player', playerSchema);
