import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";


import { loadAllMaps } from "./map_config_loader.js";

const app = express();
const PORT = 3000;



// Serve public folder (images, css, js)
app.use(express.static("public"));

// Serve map editor files
app.use("/editor", express.static("map_editor"));



// ✅ Return list of map directories (e.g. thornwood, ashen_peaks, frostveil)
app.get("/api/maps/list", (req, res) => {
  const mapsDir = path.join(process.cwd(), "public", "images", "maps");

  try {
    const folders = fs
      .readdirSync(mapsDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name.replace(/_/g, " ")); // remove underscores
    res.json(folders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load maps" });
  }
});


// Load maps dynamically
const TILESETS = await loadAllMaps();
console.log("✅ Loaded TILESETS:", Object.keys(TILESETS));

// API endpoint
app.get("/api/maps", (req, res) => {
  res.json(TILESETS);
});

app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);