import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import Entity from "../../models/baseEntity.js";
import { EntityPortal } from "../../models/entityPortal.js";

dotenv.config();

export default async function seedEntitiesFromMaps() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected.");

    // Get all map JSON files in src/config/maps
    const mapsDir = path.resolve("src/config/maps");
    const mapFiles = fs.readdirSync(mapsDir).filter(f => f.endsWith(".json"));

    for (const file of mapFiles) {
      const filePath = path.join(mapsDir, file);
      const mapData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

      if (!mapData.entities || mapData.entities.length === 0) {
        console.log(`ℹ️ No entities in map "${mapData.slug}"`);
        continue;
      }

      for (const entityData of mapData.entities) {
        if (!entityData.slug) {
          console.warn(`⚠️ Skipping entity without slug in map "${mapData.slug}"`);
          continue;
        }

        const existing = await Entity.findOne({ slug: entityData.slug, x: entityData.x, y: entityData.y, mapSlug: entityData.mapSlug });
        if (existing) {
          console.log(`↩️ Entity "${entityData.slug}" at (${entityData.x},${entityData.y}) already exists, skipping...`);
          continue;
        }

        switch (entityData.type) {
          case "portal":
            await EntityPortal.create(entityData);
            console.log(`✅ Inserted portal: ${entityData.displayName} (Map: ${entityData.mapSlug})`);
            break;
          default:
            await Entity.create(entityData);
            console.log(`✅ Inserted base entity: ${entityData.displayName} (Map: ${entityData.mapSlug})`);
            break;
        }
      }
    }

    console.log("🎉 Entity seeding from maps complete!");
  } catch (err) {
    console.error("❌ Error seeding entities:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected.");
  }
}
