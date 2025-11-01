// src/routes/playerRoutes.js
import { Router } from 'express';
import { 
  createPlayer,
  getPlayers,
  getPlayer,
  getPlayerMap,
  movePlayer,
  getNearbyPlayers,
  getNearbyEntities,
} from '../controllers/playerController.js';

const router = Router();

router.post('/', createPlayer);
router.get('/', getPlayers);
router.get('/:id', getPlayer);
router.post('/:id/move', movePlayer);
router.get('/:id/map', getPlayerMap);
router.get('/:id/nearby', getNearbyPlayers); 
router.get('/:id/nearby-entities', getNearbyEntities);

export default router;
