// src/controllers/editorController.js
import {
  getAllMapNames as getAllMapNamesService,
  getAllTilesets as getAllTilesetsService,
  getTilesetBySlug as getTilesetBySlugService,
} from '../services/editorServices.js';


// 🎯 GET /api/editor/tiles — return all tilesets (full data)
export async function getAllTilesets(req, res) {
  try {
    const tilesets = await getAllTilesetsService();
    res.json(tilesets);
  } catch (err) {
    console.error('❌ Error fetching tilesets:', err);
    res.status(500).json({ error: 'Failed to load tilesets' });
  }
}

// 🎯 GET /api/editor/tiles/:slug — single tileset by name
export async function getTilesetBySlug(req, res) {
  try {
    const { slug } = req.params;
    const tileset = await getTilesetBySlugService(slug);

    if (!tileset) {
      return res.status(404).json({ error: 'Tileset not found' });
    }

    res.json(tileset);
  } catch (err) {
    console.error('❌ Error fetching tileset:', err);
    res.status(500).json({ error: 'Failed to load tileset' });
  }
}


// 🎯 GET /api/editor/maps — list of available maps
export async function getAllMapNames(req, res) {
  try {
    const maps = await getAllMapNamesService();
    res.json(maps);
  } catch (err) {
    console.error('❌ Failed to fetch map names:', err);
    res.status(500).json({ error: 'Failed to fetch map names' });
  }
}