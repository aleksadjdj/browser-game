import Player from '../models/player.js';
import Map from '../models/map.js';


export async function createPlayerService(data) {
  const player = new Player(data);
  return await player.save();
}

export async function getPlayersService() {
  return await Player.find();
}

// 🧠 New function: get one player by custom ID
export async function getPlayerService(id) {
  return await Player.findOne({ id });
}



/**
 * Returns the visible map area for a player from MongoDB
 */
export async function getPlayerVisibleMapService(id) {
  console.log('🟢 getPlayerVisibleMapService called with id:', id);

  // 1️⃣ Find the player
  const player = await Player.findOne({ id });
  if (!player) {
    console.warn('⚠️ Player not found for id:', id);
    return { success: false, status: 404, message: 'Player not found' };
  }

  console.log(`📍 Player found: ${player.username} at (${player.x}, ${player.y})`);
  console.log(`📦 Player currentMap: ${player.currentMap}`);

  // 2️⃣ Find the map by tileset (matches player's currentMap)
  const map = await Map.findOne({ mapName: player.currentMap });
  if (!map) {
    console.warn(`⚠️ Map not found for tileset: ${player.currentMap}`);
    console.log('🧾 Existing maps in DB:');
    const maps = await Map.find({}, 'name tileset');
    console.table(maps.map(m => ({ name: m.name, mapName: m.mapName })));
    return { success: false, status: 404, message: 'Map not found' };
  }

  console.log(`🗺️ Map loaded: ${map.name} (mapName: ${map.mapName})`);
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
    name: map.name,
    mapName: map.mapName,
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
export async function movePlayerService(id, x, y) {
  const player = await Player.findOne({ id });
  if (!player) return { success: false, message: 'Player not found' };

  const dx = Math.abs(player.x - x);
  const dy = Math.abs(player.y - y);

  // Only allow orthogonal movement by 1 tile
  if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
    player.x = x;
    player.y = y;
    await player.save();
    return { success: true, player };
  }

  return { success: false, message: 'Invalid move' };
}