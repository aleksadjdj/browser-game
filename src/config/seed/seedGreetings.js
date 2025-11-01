import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import Greetings from "../../models/greetings.js";

dotenv.config();

const __dirname = path.resolve();
const greetingsPath = path.join(__dirname, "src", "config", "greetings", "greetings.json");

export default async function seedGreetings() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected.");

    if (!fs.existsSync(greetingsPath)) {
      console.error(`❌ JSON file not found: ${greetingsPath}`);
      return;
    }

    const rawData = fs.readFileSync(greetingsPath, "utf-8");
    const greetingsData = JSON.parse(rawData);

    // Validate that greetingsData is an object, not array
    if (!greetingsData || !greetingsData.type || !Array.isArray(greetingsData.messages)) {
      console.error("❌ Invalid greetings JSON structure.");
      return;
    }

    const existing = await Greetings.findOne({ npcType: greetingsData.type });
    if (existing) {
      console.log(`⚠️ Greetings for "${greetingsData.type}" already exist, skipping...`);
    } else {
      await Greetings.create({
        npcType: greetingsData.type,
        messages: greetingsData.messages,  // ✅ match your model
      });
      console.log(`✅ Inserted greetings for NPC type: ${greetingsData.type}`);
    }

    console.log("🎉 Greeting seeding complete!");
  } catch (err) {
    console.error("❌ Error seeding greetings:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB connection closed.");
  }
}
