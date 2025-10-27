import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Tileset from '../../models/tileset.js';
import { CONFIG_TILES_ASHEN_PEAKS } from '../tiles/ashen_peaks.js';
import { CONFIG_TILES_THORNWOOD } from '../tiles/thornwood.js';

dotenv.config();


const tilesets = [
  { 
    name: 'ashen_peaks', 
    displayName: 'Ashen Peaks',
    data: CONFIG_TILES_ASHEN_PEAKS 
  },
  { 
    name: 'thornwood', 
    displayName: 'Thornwood',
    data: CONFIG_TILES_THORNWOOD 
  }
];



export default async function seedTilesets() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected.');

    for (const { name, displayName, data } of tilesets) {
      const tiles = Object.values(data); // convert object → array

      // 🧹 Remove duplicates if already exists
      const existing = await Tileset.findOne({ name });
      if (existing) {
        console.log(`⚠️ Tileset "${name}" already exists, skipping...`);
        continue;
      }

      await Tileset.create({ name, displayName,  tiles });
      console.log(`✅ Inserted tileset: ${name} (${tiles.length} tiles)`);
    }

    console.log('🎉 Tileset seeding complete!');
  } catch (err) {
    console.error('❌ Error seeding tilesets:', err.message);
  }
}

