// src/config/seed/seeder.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedMaps from './seedMaps.js';
import seedPlayers from './seedPlayers.js';
import seedTilesets from './seedTilesets.js';

dotenv.config();

async function connectDB() {
  console.log('🔗 Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected.');
}

async function dropDatabase() {
  console.log('⚠️ Dropping existing database...');
  await mongoose.connection.dropDatabase();
  console.log('🧹 Database dropped.');
}

async function seedData() {
  try {
    await connectDB();

    // Optional drop before seeding
    if (process.argv.includes('--drop')) {
      await dropDatabase();
    }

    console.log('🌱 Seeding data...');
    await seedPlayers();
    await seedTilesets();
    await seedMaps();

    console.log('🎉 Seeding completed successfully.');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 MongoDB disconnected.');
  }
}

seedData();

