import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load all maps from src/config/maps/
const mapsDir = path.join(__dirname, "src", "config", "maps");

/**
 * Dynamically loads all map configuration files
 * (expects either default or named exports)
 */
export async function loadAllMaps() {
  const files = fs.readdirSync(mapsDir).filter(file => file.endsWith(".js"));
  const maps = {};

  for (const file of files) {
    const fileUrl = pathToFileURL(path.join(mapsDir, file)).href;
    const module = await import(fileUrl);

    // Extract map name from filename, e.g. "map_ashen_peaks" → "ashen_peaks"
    const mapName = file
      .replace(/^map_/, "")
      .replace(/\.js$/, "")
      .toLowerCase();

    // Use default export if available, otherwise first named export
    maps[mapName] = module.default || Object.values(module)[0];
  }

  return maps;
}
