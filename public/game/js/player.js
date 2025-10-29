export class Player {
  constructor(mapContainerId = "map", tileSize = 64, playerId = "player_uuid_1") {
    this.mapContainer = document.getElementById(mapContainerId);
    this.tileSize = tileSize;
    this.id = playerId;
    this.player = null;
    this.logContainer = document.getElementById("log");
  }

  log(message) {
    if (!this.logContainer) {
      alert(message);
      return;
    }

    const line = document.createElement("div");
    line.textContent = message;
    this.logContainer.appendChild(line);

    // ✅ Limit to 32 lines
    const maxLines = 32;
    while (this.logContainer.children.length > maxLines) {
      this.logContainer.removeChild(this.logContainer.firstChild);
    }

    this.logContainer.scrollTop = this.logContainer.scrollHeight;
  }

  async loadPlayer() {
    try {
      const res = await fetch(`/api/player/${this.id}`);
      if (!res.ok) throw new Error("Failed to load player.");
      this.player = await res.json();
      document.getElementById("output").textContent = JSON.stringify(this.player, null, 2);
      this.log("✅ Player loaded successfully.");
    } catch (err) {
      console.error("❌ Failed to load player:", err);
      document.getElementById("output").textContent = "Failed to load player data.";
      this.log("❌ Failed to load player.");
    }
  }

  async loadPlayerMap() {
    try {
      const res = await fetch(`/api/player/${this.id}/map`);
      if (!res.ok) throw new Error("Failed to load player map.");
      const data = await res.json();
      this.x = data.player.x;
      this.y = data.player.y;
      this.fow = data.player.fow;
      this.renderMap(data.visibleTiles, data.player);
      await this.loadNearbyPlayers();
      // this.log("🗺️ Map loaded.");
    } catch (err) {
      console.error("❌ Failed to load player map:", err);
      document.getElementById("output").textContent = "Failed to load map data.";
      this.log("❌ Failed to load map data.");
    }
  }

  async loadNearbyPlayers() {
    try {
      const res = await fetch(`/api/player/${this.id}/nearby`);
      if (!res.ok) throw new Error("Failed to load nearby players.");

      const data = await res.json();
      const { nearbyPlayers } = data;

      // Remove previous markers
      this.mapContainer.querySelectorAll(".other-player").forEach(el => el.remove());

      for (const other of nearbyPlayers) {
        const tileEl = this.mapContainer.querySelector(
          `.tile[data-x="${other.x}"][data-y="${other.y}"]`
        );
        if (!tileEl) continue;

        // 🧱 Base marker (positioned exactly over the tile)
        const marker = document.createElement("div");
        marker.classList.add("other-player");
        Object.assign(marker.style, {
          position: "absolute",
          left: tileEl.style.left,
          top: tileEl.style.top,
          width: tileEl.style.width,
          height: tileEl.style.height,
          backgroundColor: "transparent",
          border: "1px solid red",
          zIndex: 3,
          pointerEvents: "none",
        });

        // 🏷 Username label (8px above)
        const label = document.createElement("div");
        label.textContent = other.username || other.id;
        Object.assign(label.style, {
          position: "absolute",
          left: "50%",
          bottom: "100%", // position above the marker
          transform: "translateX(-50%) translateY(-8px)",
          fontSize: "12px",
          color: "white",
          textShadow: "0 0 2px black",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          zIndex: 4,
        });

        marker.appendChild(label);
        this.mapContainer.appendChild(marker);
      }

      this.log(`👥 Nearby players: ${nearbyPlayers.length}`);
    } catch (err) {
      console.error("❌ Failed to load nearby players:", err);
      this.log("❌ Failed to load nearby players.");
    }
  }


  renderMap(tiles, player) {
    if (!this.mapContainer) return;
    this.mapContainer.innerHTML = "";
    const minX = Math.min(...tiles.map(t => t.x));
    const minY = Math.min(...tiles.map(t => t.y));
    const width = Math.max(...tiles.map(t => t.x)) - minX + 1;
    const height = Math.max(...tiles.map(t => t.y)) - minY + 1;
    const tileSize = this.tileSize || 64;
    const fow = player.fow || 5;
    const containerSize = fow * tileSize;
    Object.assign(this.mapContainer.style, {
      position: "relative",
      width: `${containerSize}px`,
      height: `${containerSize}px`,
      border: "1px solid #aaa",
      backgroundColor: "#000000",
    });
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
      if (t.x === player.x && t.y === player.y) {
        tileDiv.style.outline = "2px solid blue";
        tileDiv.style.zIndex = "2";
      }
      tileDiv.addEventListener("click", () => this.onTileClick(tileDiv));
      this.mapContainer.appendChild(tileDiv);
    }
  }

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
      this.log("⚠️ You can only move to adjacent tiles!");
    }
  }

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
        await this.loadPlayerMap();
        this.log(`🚶 Player moved to (${tx}, ${ty}).`);
      } else {
        this.log(`❌ Move not allowed: ${data.message}`);
      }
    } catch (err) {
      console.error("❌ Move request failed:", err);
    }
  }
}
