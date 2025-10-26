import express from "express";
import fs from "fs";
import path from "path";

import { loadAllMaps } from "../../map-config-loader.js";

const router = express.Router();

// ✅ Return list of map directories (e.g. thornwood, ashen_peaks, frostveil)
router.get("/list", (req, res) => {
  const mapsDir = path.join(process.cwd(), "public", "images", "maps");

  try {
    const folders = fs
      .readdirSync(mapsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name.replace(/_/g, " ")); // remove underscores
    res.json(folders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load maps" });
  }
});

// ✅ Load maps dynamically
const TILESETS = await loadAllMaps();
console.log("✅ Loaded TILESETS:", Object.keys(TILESETS));

// ✅ Return loaded maps
router.get("/", (req, res) => {
  res.json(TILESETS);
});

export default router;