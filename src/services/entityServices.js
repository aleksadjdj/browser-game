import Player from '../models/player.js';

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

