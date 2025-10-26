import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const playersPath = path.join(__dirname, "../game/players/players.json");
const mapsDir = path.join(__dirname, "../game/maps");

// Helper to load JSON files
function loadJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

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

    // Clamp FOW bounds to map edges
    const minX = x;
    const maxX = Math.min(map.width - 1, x + fow - 1);
    const minY = y;
    const maxY = Math.min(map.height - 1, y + fow - 1);

    // Filter visible tiles within bounds
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





export default router;
