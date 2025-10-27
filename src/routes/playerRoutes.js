// src/routes/playerRoutes.js
import { Router } from 'express';
import { 
  createPlayer,
  getPlayers,
  getPlayer,
  getPlayerMap,
  movePlayer
} from '../controllers/playerController.js';

const router = Router();

router.post('/', createPlayer);
router.get('/', getPlayers);
router.get('/:id', getPlayer);

// POST /api/player/:id/move
router.post('/:id/move', movePlayer);
router.get('/:id/map', getPlayerMap);

export default router;
