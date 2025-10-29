// src/controllers/playerController.js
import {  
  createPlayerService,  
  getPlayersService, 
  getPlayerService,
  getPlayerVisibleMapService,
  movePlayerService,
  getNearbyPlayersService 
} from '../services/playerServices.js';


export async function createPlayer(req, res) {
  try {
    const player = await createPlayerService(req.body);
    res.status(201).json(player);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


// 🧠 New controller: GET /api/players/:id
export async function getPlayer(req, res) {
  try {
    const { id } = req.params;
    console.log('🟢 getPlayer called with id:', id); // ✅ add debug log
    const player = await getPlayerService(id);

    if (!player) {
      console.log('⚠️ Player not found');
      return res.status(404).json({ error: 'Player not found' });
    }

    res.json(player);
  } catch (err) {
    console.error('❌ Error fetching player by ID:', err);
    res.status(500).json({ error: 'Failed to fetch player' });
  }
}


export async function getPlayers(req, res) {
  try {
    const players = await getPlayersService();
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


export async function getPlayerMap(req, res) {
  try {
    const { id } = req.params;
    const result = await getPlayerVisibleMapService(id);

    if (!result.success) {
      return res.status(result.status || 400).json({ error: result.message });
    }

    res.json(result.data);
  } catch (err) {
    console.error('❌ Error generating player map:', err);
    res.status(500).json({ error: 'Failed to generate map view' });
  }
}


export async function movePlayer(req, res) {
  try {
    const { id } = req.params;
    const { x, y } = req.body;

    const result = await movePlayerService(id, x, y);
    res.json(result);
  } catch (err) {
    console.error('❌ Error moving player:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}



export async function getNearbyPlayers(req, res) {
  try {
    const { id } = req.params;
    const result = await getNearbyPlayersService(id);

    if (!result.success) {
      return res.status(result.status || 404).json(result);
    }

    res.json(result.data);
  } catch (err) {
    console.error("❌ Failed to get nearby players:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}