import Player from '../models/player.js';
import Map from '../models/map.js';
import Tileset from '../models/tileset.js';
import Entity  from '../models/baseEntity.js'; 


export async function createPlayerService(data) {
  const player = new Player(data);
  return await player.save();
}

export async function getPlayersService() {
  return await Player.find();
}




// 🧠 New function: get one player by custom ID
export async function getPlayerService(id) {
  const player = await Player.findOneAndUpdate(
    { id },
    { lastActive: Date.now(), onlineStatus: true },
    { new: true }
  );
  return player;
}

/**
 * Returns the visible map area for a player from MongoDB
 */
export async function getPlayerVisibleMapService(id) {
  console.log('🟢 getPlayerVisibleMapService called with id:', id);

  // 1️⃣ Find the player
  const player = await Player.findOneAndUpdate(
    { id },
    { lastActive: Date.now() },
    { new: true }
  );

  if (!player) {
    console.warn('⚠️ Player not found for id:', id);
    return { success: false, status: 404, message: 'Player not found' };
  }

  console.log(`📍 Player found: ${player.username} at (${player.x}, ${player.y})`);
  console.log(`📦 Player currentMap: ${player.currentMap}`);

  // 2️⃣ Find the map by tileset (matches player's currentMap)
  const map = await Map.findOne({ slug: player.currentMap });
  if (!map) {
    console.warn(`⚠️ Map not found for tileset: ${player.currentMap}`);
    console.log('🧾 Existing maps in DB:');
    const maps = await Map.find({}, 'slug displayName data');
    console.table(maps.map(m => ({ mapSlug: m.slug, displayName: m.displayName, data: m.data })));
    return { success: false, status: 404, message: 'Map not found' };
  }

  console.log(`🗺️ Map loaded: ${map.slug} (mapName: ${map.displayName})`);
  console.log(`📏 Map size: ${map.width}x${map.height}`);
  console.log(`🧩 Total tiles: ${map.data?.length || 0}`);

  // 3️⃣ Calculate visible area
  const { x, y, fow } = player;
  const radius = Math.floor(fow / 2);
  console.log(`🔦 FOW radius: ${radius}`);

  const minX = Math.max(0, x - radius);
  const maxX = Math.min(map.width - 1, x + radius);
  const minY = Math.max(0, y - radius);
  const maxY = Math.min(map.height - 1, y + radius);

  console.log(`🔍 Visible area X: ${minX}-${maxX}, Y: ${minY}-${maxY}`);

  // 4️⃣ Filter visible tiles
  const visibleTiles = (map.data || []).filter(t =>
    t.x >= minX && t.x <= maxX &&
    t.y >= minY && t.y <= maxY
  );

  console.log(`✅ Visible tiles count: ${visibleTiles.length}`);

  // 5️⃣ Build the cropped response
  const croppedMap = {
    mapSLug: map.slug,
    displayName: map.displayName,
    width: map.width,
    height: map.height,
    player: { id, x, y, fow },
    visibleTiles
  };

  console.log('🎉 Cropped map built successfully.');
  return { success: true, data: croppedMap };
}



/**
 * Moves a player if the move is valid.
 */
export async function movePlayerService_OLD_v1(id, x, y) {
  const player = await Player.findOne({ id });
  if (!player) return { success: false, message: 'Player not found' };

  const dx = Math.abs(player.x - x);
  const dy = Math.abs(player.y - y);

  // Only allow orthogonal movement by 1 tile
  if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
    player.x = x;
    player.y = y;
    player.lastActive = Date.now();
    await player.save();
    return { success: true, player };
  }

  return { success: false, message: 'Invalid move' };
}




export async function movePlayerService(id, x, y) {
  const player = await Player.findOne({ id });
  if (!player) return { success: false, message: "Player not found" };

  const dx = Math.abs(player.x - x);
  const dy = Math.abs(player.y - y);

  // Only allow orthogonal movement by 1 tile
  if (!((dx === 1 && dy === 0) || (dx === 0 && dy === 1))) {
    return { success: false, message: "Invalid move" };
  }

  // ✅ Load map and tileset by player's currentMap
  const map = await Map.findOne({ slug: player.currentMap });
  if (!map) return { success: false, message: "Map not found" };

  const tileset = await Tileset.findOne({ mapSlug: player.currentMap });
  if (!tileset) return { success: false, message: "Tileset not found" };

  // ✅ Find tile at destination
  const tileData = map.data.find(t => t.x === x && t.y === y);
  if (!tileData) return { success: false, message: "No tile at target position" };

  // ✅ Match with tile definition from tileset
  const tileType = tileset.tiles.find(t => t.slug === tileData.tileSlug);
  if (!tileType) return { success: false, message: "Tile type not found in tileset" };

  // ✅ Check if walkable
  if (!tileType.walkable) {
    return { success: false, message: `Cannot walk on ${tileType.name}` };
  }

  // ✅ Move player
  player.x = x;
  player.y = y;
  player.lastActive = Date.now();
  await player.save();

  return { success: true, player };
}



export async function getNearbyPlayersService(id) {
  // 1️⃣ Find the main player
  const player = await Player.findOne({ id });
  if (!player) {
    return { success: false, status: 404, message: "Player not found" };
  }

  // 🕒 Update lastActive each time player pings
  player.lastActive = Date.now();
  await player.save();

  // Normalize map name
  const currentMap = (player.currentMap || "").toLowerCase();

  // 2️⃣ Extract range (based on field of view)
  const { x, y, fow = 5 } = player;
  const radius = Math.floor(fow / 2);

  const minX = x - radius;
  const maxX = x + radius;
  const minY = y - radius;
  const maxY = y + radius;

  // 3️⃣ Find all other players on same map and within range
  const THIRTY_SECONDS_AGO = Date.now() - 30 * 1000;

  const nearbyPlayers = await Player.find({
    currentMap: new RegExp(`^${currentMap}$`, "i"),
    id: { $ne: id },
    x: { $gte: minX, $lte: maxX },
    y: { $gte: minY, $lte: maxY },
    lastActive: { $gte: THIRTY_SECONDS_AGO }, // ✅ Only active players
  }).select("id username x y currentMap lastActive");

  // 4️⃣ Return structured data
  return {
    success: true,
    data: {
      player: { id, x, y, fow, currentMap, lastActive: player.lastActive },
      nearbyPlayers,
    },
  };
}





export async function getNearbyEntitiesService(playerId) {
  // 1️⃣ Find the main player
  const player = await Player.findOne({ id: playerId });
  if (!player) {
    return { success: false, status: 404, message: "Player not found" };
  }

  // 🕒 Update lastActive each time player pings
  player.lastActive = Date.now();
  await player.save();

  const currentMap = (player.currentMap || "").toLowerCase();
  const { x, y, fow = 5 } = player;
  const radius = Math.floor(fow / 2);

  const minX = x - radius;
  const maxX = x + radius;
  const minY = y - radius;
  const maxY = y + radius;

  // 2️⃣ Find nearby entities on the same map and within range
  const nearbyEntities = await Entity.find({
    mapSlug: new RegExp(`^${currentMap}$`, "i"),
    x: { $gte: minX, $lte: maxX },
    y: { $gte: minY, $lte: maxY }
  }).select('slug displayName type x y texture');

  return {
    success: true,
    data: {
      player: { id: player.id, x, y, fow, currentMap, lastActive: player.lastActive },
      nearbyEntities
    }
  };
}
