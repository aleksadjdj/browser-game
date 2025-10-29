export class Map {
  constructor(url) {
    this.url = url;
    this.tiles = [];
    this.width = 0;
    this.height = 0;
  }

  async load() {
    const res = await fetch(this.url);
    const data = await res.json();
    this.tiles = data.data;
    this.width = data.width;
    this.height = data.height;
  }

  draw(ctx, tileSize = 64) {
    for (const tile of this.tiles) {
      ctx.fillStyle = "#6b8e23"; // simple color for grass
      ctx.fillRect(tile.x * tileSize, tile.y * tileSize, tileSize, tileSize);
    }
  }
}
