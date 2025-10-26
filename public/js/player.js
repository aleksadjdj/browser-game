export class Player {



    constructor(mapContainerId = "map", tileSize = 64) {
      this.mapContainer = document.getElementById(mapContainerId);
      this.tileSize = tileSize;

      this.API_PLAYER_ID = "player_uuid_1";
    }


  async loadPlayer() {
    try {
      const res = await fetch("/api/player");
      const player = await res.json();
      document.getElementById("output").textContent = JSON.stringify(player, null, 2);
    } catch (err) {
      document.getElementById("output").textContent = "Failed to load player data.";
      console.error(err);
    }
  }      

  async loadPlayerMap() {
    const res = await fetch("/api/player/" + this.API_PLAYER_ID + "/map");
    const data = await res.json();
    document.getElementById("output").textContent = JSON.stringify(data, null, 2);

    // Store actual player coordinates
    this.x = data.player.x;
    this.y = data.player.y;

    // Render the visible tiles
    this.renderMap(data.visibleTiles);

    // Highlight + raise current player tile
    const playerTile = Array.from(this.mapContainer.children).find(div => 
      parseInt(div.dataset.x) === this.x && parseInt(div.dataset.y) === this.y
    );
    if (playerTile) {
      playerTile.style.outline = "2px solid blue";
      playerTile.style.zIndex = "1"; // 👈 player tile on top
    }
  }

  renderMap(tiles) {
    if (!this.mapContainer) return;

    // Clear previous tiles
    this.mapContainer.innerHTML = "";

    // Find min/max x and y to normalize coordinates
    const minX = Math.min(...tiles.map(t => t.x));
    const minY = Math.min(...tiles.map(t => t.y));
    const width = Math.max(...tiles.map(t => t.x)) - minX + 1;
    const height = Math.max(...tiles.map(t => t.y)) - minY + 1;

    this.mapContainer.style.position = "relative";
    this.mapContainer.style.width = width * this.tileSize + "px";
    this.mapContainer.style.height = height * this.tileSize + "px";
    this.mapContainer.style.border = "1px solid #aaa";

    tiles.forEach(t => {
      const div = document.createElement("div");
      div.style.position = "absolute";

      // normalize position relative to top-left of visible area
      div.style.left = (t.x - minX) * this.tileSize + "px";
      div.style.top = (t.y - minY) * this.tileSize + "px";

      div.style.width = this.tileSize + "px";
      div.style.height = this.tileSize + "px";
      div.style.backgroundImage = `url(${t.url})`;
      div.style.backgroundSize = "cover";
      div.style.border = "1px solid rgba(0,0,0,0.1)";

      div.dataset.x = t.x;
      div.dataset.y = t.y;

      div.addEventListener("click", () => this.onTileClick(div));
      this.mapContainer.appendChild(div);
    });
  }


   onTileClick(tileDiv) {
    const tx = parseInt(tileDiv.dataset.x);
    const ty = parseInt(tileDiv.dataset.y);

    // Check if tile is adjacent (4 directions)
    const dx = Math.abs(tx - this.x);
    const dy = Math.abs(ty - this.y);

    if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
      // Red flash effect
      tileDiv.style.border = "2px solid red";
      setTimeout(() => {
        tileDiv.style.border = "1px solid rgba(255,0,0,0.5)";
      }, 300);

      //if (confirm(`Move player to (${tx}, ${ty})?`)) {
        this.movePlayer(tx, ty);
      //}
    } else {
      alert("Can only move to adjacent tiles!");
    }
  }

  async movePlayer(tx, ty) {
    try {
      const res = await fetch(`/api/player/${"player_uuid_1"}/move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ x: tx, y: ty })
      });

      const data = await res.json();
      if (data.success) {
        this.x = tx;
        this.y = ty;
        this.loadPlayerMap(); // refresh visible tiles
      } else {
        alert("Move not allowed: " + data.message);
      }
    } catch (err) {
      console.error("Move request failed:", err);
    }
  }
  
}