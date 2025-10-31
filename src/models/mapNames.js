// src/models/player.js
import { Schema, model } from 'mongoose';

/*
* Displays available maps in the editor
* displayName: "Ashen Peaks", slug: "ashen_peaks"
* displayName: "Aca's Peaks", slug: "acas_peaks"
* used in editor to select map by name instead of slug
*/

const mapNamesSchema = new Schema({
  slug: {
    type: String,
    unique: true 
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
});

export default model('MapNames', mapNamesSchema);
