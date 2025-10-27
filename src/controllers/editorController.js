// src/controllers/editorController.js
import {
  getAllTilesetNames as getAllTilesetNamesService,
  getAllTilesets as getAllTilesetsService,
  getTilesetByName as getTilesetByNameService
} from '../services/editorServices.js';

// 🎯 GET /api/maps/list — list all tileset names
export async function getAllTilesetNames(req, res) {
  try {
    const names = await getAllTilesetNamesService();
    res.json(names);
  } catch (err) {
    console.error('❌ Error fetching tileset list:', err);
    res.status(500).json({ error: 'Failed to load map list' });
  }
}

// 🎯 GET /api/maps — return all tilesets (full data)
export async function getAllTilesets(req, res) {
  try {
    const tilesets = await getAllTilesetsService();
    res.json(tilesets);
  } catch (err) {
    console.error('❌ Error fetching tilesets:', err);
    res.status(500).json({ error: 'Failed to load tilesets' });
  }
}

// 🎯 GET /api/maps/:name — single tileset by name
export async function getTilesetByName(req, res) {
  try {
    const { name } = req.params;
    const tileset = await getTilesetByNameService(name);

    if (!tileset) {
      return res.status(404).json({ error: 'Tileset not found' });
    }

    res.json(tileset);
  } catch (err) {
    console.error('❌ Error fetching tileset:', err);
    res.status(500).json({ error: 'Failed to load tileset' });
  }
}
