// src/services/editorServices.js
import MapNames from '../models/mapNames.js';
import Tileset from '../models/tileset.js';


// 🗺️ Get list of all map names (from MapNames collection)
export async function getAllMapNames() {
  return await MapNames.find();
}

// 🧠 Get all tilesets with full tile data
export async function getAllTilesets() {
  return await Tileset.find();
}

// 🧠 Get one tileset by name
export async function getTilesetBySlug(slug) {
  return await Tileset.findOne({ mapSlug: slug });
}




export async function getEntityModels() {
  // You can manually define what you want exposed in the editor
  // to avoid loading private or unused models dynamically

  return [
    {
      name: "Portal",
      type: "portal",
      fields: [
        { key: "slug", label: "Slug", type: "text", required: true, value: "static_entity_portal_01.gif" },
        { key: "displayName", label: "Display Name", type: "text", required: true, value: "Portal to " },
        { key: "texture", label: "Texture Path", type: "text", required: true, value: "/images/entities/static/portals/static_entity_portal_01.gif" },
        { key: "mapSlug", label: "Current Map", type: "text", required: true },
        { key: "x", label: "X Position", type: "number", required: true },
        { key: "y", label: "Y Position", type: "number", required: true },
        { key: "destMapSlug", label: "Destination Map", type: "text", required: true },
        { key: "destX", label: "Destination X", type: "number", required: true },
        { key: "destY", label: "Destination Y", type: "number", required: true }
      ]
    },
    {
      name: "Peasant",
      type: "peasant",
      fields: [
        { key: "slug", label: "Slug", type: "text", required: true, value: "entity_npc_peasant_01.webp" },
        { key: "displayName", label: "Display Name", type: "text", required: true },
        { key: "texture", label: "Texture Path", type: "text", required: true, value : "/images/entities/npc/entity_npc_peasant_01.webp" },
        { key: "x", label: "X", type: "number", required: true },
        { key: "y", label: "Y", type: "number", required: true },
      ]
    }
  ];
}