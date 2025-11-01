import Entity from "../models/baseEntity.js";
import { EntityPortal } from "../models/entityPortal.js"; // adjust path
import Player from "../models/player.js";
import { 
  portalService,
  peasantService,
 } from "../services/entityServices.js";

export async function interactEntityController(req, res) {
  try {
    const { id } = req.params;
      const { entityId } = req.body; //

    const player = await Player.findOne({ id });
    if (!player) return res.status(404).json({ success: false, message: "Player not found" });

    let entity = await Entity.findById(entityId);
    if (!entity) return res.status(404).json({ success: false, message: "Entity not found" });

    // fetch proper subclass if it's a portal
    if (entity.type === "portal") {
      const portalEntity = await EntityPortal.findById(entityId); // <-- use entityId
      if (!portalEntity) {
        return res.status(404).json({ success: false, message: "Portal not found" });
      }
      entity = portalEntity; // overwrite with actual portal
    }

    // --- NEW: check interaction range ---
    const dx = Math.abs(player.x - entity.x);
    const dy = Math.abs(player.y - entity.y);
    const interactionRange = 1; // allow interaction only with adjacent tiles
    if (dx > interactionRange || dy > interactionRange) {
      return res.status(400).json({
        success: false,
        message: "You are too far away to interact with this entity.",
      });
    }

    // call service
    let result;
    if (entity.type === "portal") {
      result = await portalService(player, entity); // pass full player doc
    } 
    else if (entity.type === "peasant") {
      result = await peasantService(player, entity);
    }
    else {
      // handle other entity types...
      result = { success: false, message: "Entity type not implemented yet" };
    }

    return res.json(result);

  } catch (err) {
    console.error("❌ interactEntityController error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

