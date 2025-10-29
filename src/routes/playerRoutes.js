// src/routes/playerRoutes.js
import { Router } from 'express';
import { 
  createPlayer,
  getPlayers,
  getPlayer,
  getPlayerMap,
  movePlayer,
  getNearbyPlayers
} from '../controllers/playerController.js';

const router = Router();



router.post('/', createPlayer);
router.get('/', getPlayers);
router.get('/:id', getPlayer);
router.post('/:id/move', movePlayer);
router.get('/:id/map', getPlayerMap);
router.get('/:id/nearby', getNearbyPlayers); // ✅ FIXED


export default router;
