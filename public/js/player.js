export class Player {

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

  async  loadPlayerMap() {
    const player_id = "player_uuid_1";
    const res = await fetch("/api/player/" + player_id + "/map");
    const data = await res.json();
    document.getElementById("output").textContent = JSON.stringify(data, null, 2);
    }

}