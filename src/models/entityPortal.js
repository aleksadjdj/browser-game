import mongoose from 'mongoose';
import Entity from './entity.js';

// Clone the base schema
const baseSchema = Entity.schema.clone();

// Extend with new fields
baseSchema.add({
	destMapName: { 
		type: String, 
		required: true,
		default: 'thornwood' 
	},
  destX: { 
    type: Number, 
    required: true,
    default: 3
  },
	destY: { 
    type: Number, 
    required: true,
    default: 3
  },
});

export default mongoose.model('EntityPortal', baseSchema);