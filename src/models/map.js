// src/models/map.js
import { Schema, model } from 'mongoose';

// Define the schema for each tile
const tileSchema = new Schema({
  x: {
    type: Number,
    required: true
  },
  y: {
    type: Number,
    required: true
  },
  tile: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  }
});

// Define the main map schema
const mapSchema = new Schema({
  name: {
    // Display name Ashen Peaks, Thornwood, Winter’s Veil, ...etc.
    type: String,
    required: true,
    trim: true
  },
  mapName: {
    // Internal slug - ashen_peaks, thornwood, winters_veil, ...etc.
    type: String,
    required: true
  },
  width: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  data: {
    // type Array[tileSchema]
    type: [tileSchema],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Export the model
export default model('Map', mapSchema);
