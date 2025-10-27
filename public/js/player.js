export class Player {
  constructor(mapContainerId = "map", tileSize = 64, playerId = "player_uuid_1") {
    this.mapContainer = document.getElementById(mapContainerId);
    this.tileSize = tileSize;
    this.id = playerId;

    this.player = null; // will store player object from API
  }

  // 🧭 Load player data from API
  async loadPlayer() {
    try {
      const res = await fetch(`/api/player/${this.id}`);
      if (!res.ok) throw new Error("Failed to load player.");
      this.player = await res.json();
      document.getElementById("output").textContent = JSON.stringify(this.player, null, 2);
    } catch (err) {
      console.error("❌ Failed to load player:", err);
      document.getElementById("output").textContent = "Failed to load player data.";
    }
  }

  // 🗺️ Load visible map area for this player
  async loadPlayerMap() {
    try {
      const res = await fetch(`/api/player/${this.id}/map`);
      if (!res.ok) throw new Error("Failed to load player map.");
      const data = await res.json();

      // Save current player coordinates
      this.x = data.player.x;
      this.y = data.player.y;
      this.fow = data.player.fow;

      // Render map tiles
      this.renderMap(data.visibleTiles, data.player);
    } catch (err) {
      console.error("❌ Failed to load player map:", err);
      document.getElementById("output").textContent = "Failed to load map data.";
    }
  }

  // 🎨 Render the visible tiles
  renderMap(tiles, player) {
    if (!this.mapContainer) return;

    this.mapContainer.innerHTML = "";

    // Find bounds
    const minX = Math.min(...tiles.map(t => t.x));
    const minY = Math.min(...tiles.map(t => t.y));
    const width = Math.max(...tiles.map(t => t.x)) - minX + 1;
    const height = Math.max(...tiles.map(t => t.y)) - minY + 1;

    const tileSize = this.tileSize || 64;
    const fow = player.fow || 5;
    const containerSize = fow * tileSize; // width & height

    // Container setup
    Object.assign(this.mapContainer.style, {
      position: "relative",
      width: `${containerSize}px`,
      height: `${containerSize}px`,
      border: "1px solid #aaa",
      backgroundColor: "#000000",
    });

    // Draw tiles
    for (const t of tiles) {
      const tileDiv = document.createElement("div");
      tileDiv.classList.add("tile");
      tileDiv.dataset.x = t.x;
      tileDiv.dataset.y = t.y;

      Object.assign(tileDiv.style, {
        position: "absolute",
        left: `${(t.x - minX) * this.tileSize}px`,
        top: `${(t.y - minY) * this.tileSize}px`,
        width: `${this.tileSize}px`,
        height: `${this.tileSize}px`,
        backgroundImage: `url(${t.url})`,
        backgroundSize: "cover",
        border: "1px solid rgba(0,0,0,0.1)"
      });

      // Highlight current player tile
      if (t.x === player.x && t.y === player.y) {
        tileDiv.style.outline = "2px solid blue";
        tileDiv.style.zIndex = "2";
      }

      // Add click listener
      tileDiv.addEventListener("click", () => this.onTileClick(tileDiv));
      this.mapContainer.appendChild(tileDiv);
    }
  }

  // 🧩 Handle tile click and movement
  async onTileClick(tileDiv) {
    const tx = parseInt(tileDiv.dataset.x);
    const ty = parseInt(tileDiv.dataset.y);

    const dx = Math.abs(tx - this.x);
    const dy = Math.abs(ty - this.y);

    if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
      tileDiv.style.border = "2px solid red";
      setTimeout(() => (tileDiv.style.border = "1px solid rgba(255,0,0,0.5)"), 300);
      await this.movePlayer(tx, ty);
    } else {
      alert("You can only move to adjacent tiles!");
    }
  }

  // 🚶 Move player on server and refresh map
  async movePlayer(tx, ty) {
    try {
      const res = await fetch(`/api/player/${this.id}/move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ x: tx, y: ty })
      });

      const data = await res.json();

      if (data.success) {
        this.x = tx;
        this.y = ty;
        await this.loadPlayerMap(); // refresh view
      } else {
        alert("Move not allowed: " + data.message);
      }
    } catch (err) {
      console.error("❌ Move request failed:", err);
    }
  }
}
