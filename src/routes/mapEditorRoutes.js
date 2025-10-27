import express from 'express';
import {
  getAllTilesetNames,
  getAllTilesets,
  getTilesetByName
} from '../controllers/editorController.js';

const router = express.Router();

router.get('/list', getAllTilesetNames);
router.get('/', getAllTilesets);
router.get('/:name', getTilesetByName);

export default router;
