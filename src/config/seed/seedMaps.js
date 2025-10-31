// src/config/seed/seedMaps.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import Map from '../../models/map.js';

dotenv.config();

const __dirname = path.resolve();
const mapsDir = path.join(__dirname, 'src', 'config', 'maps');

export default async function seedMaps() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected.');

    const mapFiles = fs.readdirSync(mapsDir).filter(f => f.endsWith('.json'));
    console.log(`📂 Found ${mapFiles.length} map files.`);

    for (const file of mapFiles) {
      const filePath = path.join(mapsDir, file);
      const raw = fs.readFileSync(filePath, 'utf-8');
      const jsonData = JSON.parse(raw);

      if (!jsonData.slug) {
        console.warn(`⚠️ Skipping ${file} — missing "slug" field`);
        continue;
      }

      // ✅ Use slug instead of name for duplicate check
      const existing = await Map.findOne({ slug: jsonData.slug });
      if (existing) {
        console.log(`↩️ Map "${jsonData.slug}" already exists, skipping...`);
        continue;
      }

      // ✅ Make sure tile data has correct structure
      const cleanData = (jsonData.data || []).map(tile => ({
        x: tile.x,
        y: tile.y,
        tileSlug: tile.tileSlug || tile.tile || 'unknown_tile',
        textureUrl: tile.textureUrl || tile.texture || ''
      }));

      const newMap = {
        slug: jsonData.slug,
        displayName: jsonData.displayName || jsonData.slug,
        width: jsonData.width || 0,
        height: jsonData.height || 0,
        data: cleanData
      };

      await Map.create(newMap);
      console.log(`✅ Inserted map: ${newMap.displayName} (${newMap.width}x${newMap.height})`);
    }

    console.log('🎉 Map seeding complete!');
  } catch (err) {
    console.error('❌ Error seeding maps:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 MongoDB disconnected.');
  }
}
