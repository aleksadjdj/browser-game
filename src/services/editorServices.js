// src/services/editorServices.js
import MapNames from '../models/mapNames.js';
import Tileset from '../models/tileset.js';


// 🗺️ Get list of all map names (from MapNames collection)
export async function getAllMapNames() {
  return await MapNames.find();
}

// 🧠 Get all tilesets with full tile data
export async function getAllTilesets() {
  return await Tileset.find();
}

// 🧠 Get one tileset by name
export async function getTilesetBySlug(slug) {
  return await Tileset.findOne({ mapSlug: slug });
}


