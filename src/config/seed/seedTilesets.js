import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Tileset from '../../models/tileset.js';
import { CONFIG_TILES_ASHEN_PEAKS } from '../tiles/ashen_peaks.js';
import { CONFIG_TILES_THORNWOOD } from '../tiles/thornwood.js';
import { CONFIG_TILES_DIRTY_OLD_HOUSE_01 } from '../tiles/dirty_old_house_01.js';

dotenv.config();


const tilesets = [
  { 
    mapSlug: 'ashen_peaks', 
    displayName: 'Ashen Peaks',
    data: CONFIG_TILES_ASHEN_PEAKS 
  },
  { 
    mapSlug: 'thornwood', 
    displayName: 'Thornwood',
    data: CONFIG_TILES_THORNWOOD 
  },
  { 
    mapSlug: 'dirty_old_house_01', 
    displayName: 'Dirty Old House',
    data: CONFIG_TILES_DIRTY_OLD_HOUSE_01 
  }
];



export default async function seedTilesets() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected.');

    for (const { mapSlug, displayName, data } of tilesets) {
      const tiles = Object.values(data); // convert object → array

      // 🧹 Remove duplicates if already exists
      const existing = await Tileset.findOne({ mapSlug });
      if (existing) {
        console.log(`⚠️ Tileset "${mapSlug}" already exists, skipping...`);
        continue;
      }

      await Tileset.create({ mapSlug, displayName,  tiles });
      console.log(`✅ Inserted tileset: ${mapSlug} (${tiles.length} tiles)`);
    }

    console.log('🎉 Tileset seeding complete!');
  } catch (err) {
    console.error('❌ Error seeding tilesets:', err.message);
  }
}

