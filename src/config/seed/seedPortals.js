// src/config/seed/seedPortals.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { EntityPortal } from '../../models/entityPortal.js';
import { STATIC_ENTITIES_PORTALS } from '../entities/static/portalEntities.js';

dotenv.config();

export default async function seedPortals() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected.');

    for (const portalData of STATIC_ENTITIES_PORTALS) {
      if (!portalData.slug) {
        console.warn(`⚠️ Skipping portal — missing "slug" field`);
        continue;
      }

      const existing = await EntityPortal.findOne({ slug: portalData.slug });
      if (existing) {
        console.log(`↩️ Portal "${portalData.slug}" already exists, skipping...`);
        continue;
      }

      await EntityPortal.create(portalData);
      console.log(`✅ Inserted portal: ${portalData.displayName} (${portalData.slug})`);
    }

    console.log('🎉 Portal seeding complete!');
  } catch (err) {
    console.error('❌ Error seeding portals:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 MongoDB disconnected.');
  }
}
