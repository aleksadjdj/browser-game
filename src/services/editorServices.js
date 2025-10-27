// src/services/editorServices.js
import Tileset from '../models/tileset.js';

// 🧠 Get list of all tilesets (map names)
export async function getAllTilesetNames() {
  const tilesets = await Tileset.find({}, 'name'); // only return name field
  return tilesets.map(t => t.name);
}

// 🧠 Get all tilesets with full tile data
export async function getAllTilesets() {
  return await Tileset.find();
}

// 🧠 Get one tileset by name
export async function getTilesetByName(name) {
  return await Tileset.findOne({ name });
}
