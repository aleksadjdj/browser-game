import { Map } from "./map.js";
import { Player } from "./player.js";

export class Game {
  constructor(mapUrl) {
    this.mapUrl = mapUrl;
    this.map = new Map(mapUrl);
    this.player = new Player(2, 2);
    this.canvas = document.getElementById("game");
    this.ctx = this.canvas.getContext("2d");
  }

  async init() {
    await this.map.load();
    this.canvas.addEventListener("click", this.onClick.bind(this));
    this.update();
  }

  onClick(e) {
    const tileSize = 64;
    const rect = this.canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / tileSize);
    const y = Math.floor((e.clientY - rect.top) / tileSize);
    this.player.moveTo(x, y);
    this.update();
  }

  update() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.map.draw(this.ctx);
    this.player.draw(this.ctx);
  }
}
