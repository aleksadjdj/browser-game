import Greetings from '../models/greetings.js'


export async function portalService(player, entity) {
  try {
    console.log("📝 portalService called", { player, entity });

    if (!player) throw new Error("Player not found.");

    // Check entity coordinates
    if (entity.destX == null || entity.destY == null || !entity.destMapSlug) {
      console.error("❌ Entity missing destination data", entity);
      throw new Error("Entity destination data incomplete");
    }

    console.log(`📦 Teleporting player ${player.id} → ${entity.destMapSlug} (${entity.destX}, ${entity.destY})`);

    // update location
    player.currentMap = entity.destMapSlug;
    player.x = entity.destX;
    player.y = entity.destY;
    player.lastActive = Date.now();

    console.log("💾 Saving player...");
    await player.save();
    console.log("✅ Player saved successfully");

    return {
      success: true,
      message: `Teleported to ${entity.destMapSlug}`,
      player: {
        id: player.id,
        currentMap: player.currentMap,
        x: player.x,
        y: player.y,
      },
    };
  } catch (err) {
    console.error("❌ Portal teleportation failed:", err);
    return { success: false, message: `Failed to teleport player: ${err.message}` };
  }
}



export async function peasantService(player, entity) {
  try {
    console.log("📝 peasantService called", { player, entity });

    if (!player) throw new Error("Player not found.");

    player.lastActive = Date.now();
    console.log("💾 Saving player...");
    await player.save();
    console.log("✅ Player saved successfully");

   // Fetch greetings for peasant NPCs
    let greetings = [];

    try {
      const doc = await Greetings.findOne({ npcType: "peasant" });
      if (doc && doc.messages.length > 0) {  // ✅ use messages, not greetings
        greetings = doc.messages;
      }
    } catch (err) {
      console.warn("⚠️ Could not load peasant greetings:", err.message);
    }

    // Pick a random greeting
    const message = greetings.length > 0
      ? greetings[Math.floor(Math.random() * greetings.length)]
      : "Hello!"; // fallback message

    return {
      success: true,
      message,
      player: {
        id: player.id,
        currentMap: player.currentMap,
        x: player.x,
        y: player.y
      },
    };
  } catch (err) {
    console.error("❌ Peasant interaction failed:", err);
    return { success: false, message: `Failed to interact with peasant: ${err.message}` };
  }
}