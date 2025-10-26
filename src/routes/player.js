import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { saveJSON, loadJSON } from "../helpers/utils.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const playersPath = path.join(__dirname, "../game/players/players.json");
const mapsDir = path.join(__dirname, "../game/maps");



// 👉 GET /api/player — first player (demo)
router.get("/", (req, res) => {
  try {
    const players = loadJSON(playersPath);
    res.json(players[0]);
  } catch (err) {
    console.error("Error reading player file:", err);
    res.status(500).json({ error: "Failed to read player data" });
  }
});



// 👉 GET /api/player/:id/map — visible map area
router.get("/:id/map", (req, res) => {
  try {
    const { id } = req.params;
    const players = loadJSON(playersPath);
    const player = players.find(p => p.id === id);

    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }

    const mapPath = path.join(mapsDir, `${player.currentMap}.json`);
    if (!fs.existsSync(mapPath)) {
      return res.status(404).json({ error: "Map not found" });
    }

    const map = loadJSON(mapPath);

    const { x, y, fow } = player;
    const radius = Math.floor(fow / 2);

    const minX = Math.max(0, x - radius);
    const maxX = Math.min(map.width - 1, x + radius);
    const minY = Math.max(0, y - radius);
    const maxY = Math.min(map.height - 1, y + radius);

    const visibleTiles = map.data.filter(t =>
      t.x >= minX && t.x <= maxX &&
      t.y >= minY && t.y <= maxY
    );

    const croppedMap = {
      name: map.name,
      tileset: map.tileset,
      width: map.width,
      height: map.height,
      player: { id, x, y, fow },
      visibleTiles
    };

    res.json(croppedMap);
  } catch (err) {
    console.error("Error generating map view:", err);
    res.status(500).json({ error: "Failed to generate map view" });
  }
});


// 👉 POST /api/player/:id/move — move player
router.post("/:id/move", (req, res) => {
  const { id } = req.params;
  const { x, y } = req.body;

  // load player from JSON
  const players = loadJSON(playersPath);
  const player = players.find(p => p.id === id);
  if (!player) return res.json({ success: false, message: "Player not found" });

  const dx = Math.abs(player.x - x);
  const dy = Math.abs(player.y - y);
  if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
    // valid move
    player.x = x;
    player.y = y;
    saveJSON(playersPath, players);
    return res.json({ success: true });
  }

  return res.json({ success: false, message: "Invalid move" });
});





export default router;
