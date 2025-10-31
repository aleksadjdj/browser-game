// src/config/seed/seedMapNames.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import MapNames from '../../models/mapNames.js';


dotenv.config();

const __dirname = path.resolve();

// 📁 Path to your JSON file
const mapNamesPath = path.join(__dirname, 'src', 'config', 'mapNames', 'mapNames.json');

export default async function seedMapNames() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected.');

    if (!fs.existsSync(mapNamesPath)) {
      console.error(`❌ JSON file not found: ${mapNamesPath}`);
      return;
    }

    const rawData = fs.readFileSync(mapNamesPath, 'utf-8');
    const mapNames = JSON.parse(rawData);

    for (const map of mapNames) {
      const existing = await MapNames.findOne({ slug: map.slug });
      if (existing) {
        console.log(`⚠️ Map "${map.displayName}" already exists, skipping...`);
        continue;
      }

      await MapNames.create(map);
      console.log(`✅ Inserted map: ${map.displayName}`);
    }

    console.log('🎉 Map name seeding complete!');
  } catch (err) {
    console.error('❌ Error seeding map names:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 MongoDB connection closed.');
  }
}

