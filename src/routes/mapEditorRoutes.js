import express from 'express';
import {
  getAllTilesets,
  getTilesetBySlug,
  getAllMapNames
} from '../controllers/editorController.js';

const router = express.Router();


// 🗺️ Maps
// /api/editor/maps
router.get('/maps', getAllMapNames);


// 🧩 Tilesets
// /api/editor/tiles/
router.get('/tiles', getAllTilesets);

// /api/editor/tiles/thornwoood
router.get('/tiles/:slug', getTilesetBySlug);



export default router;
