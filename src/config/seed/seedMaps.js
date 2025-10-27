import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import Map from '../../models/map.js';

dotenv.config();

const __dirname = path.resolve();

// 🗺️ Map config folder
const mapsDir = path.join(__dirname, 'src', 'config', 'maps');

// 🧩 List of maps to seed (auto-detects JSON files)
const mapFiles = [
    'Thornwood.json', 
    'AshenPeaks.json',
];

export default async function seedMaps() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected.');

    for (const file of mapFiles) {
      const filePath = path.join(mapsDir, file);

      if (!fs.existsSync(filePath)) {
        console.warn(`⚠️ File not found: ${filePath}`);
        continue;
      }

      const raw = fs.readFileSync(filePath, 'utf-8');
      const jsonData = JSON.parse(raw);

      const existing = await Map.findOne({ name: jsonData.name });
      if (existing) {
        console.log(`⚠️ Map "${jsonData.name}" already exists, skipping...`);
        continue;
      }

      await Map.create(jsonData);
      console.log(`✅ Inserted map: ${jsonData.name} (${jsonData.width}x${jsonData.height})`);
    }

    console.log('🎉 Map seeding complete!');
  } catch (err) {
    console.error('❌ Error seeding maps:', err.message);
  }
}

