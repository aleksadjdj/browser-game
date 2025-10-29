import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Player from '../../models/player.js';

dotenv.config();


const players = [
	{
		id: 'player_uuid_1',
		username: 'Player 1',
		x: 1,
		y: 1,
		fow: 5,
		hp: 10,
		movePoints: 10,
		currentMap: 'ashen_peaks',
		lastActive: Date.now(),
	},
	{
		id: 'player_uuid_2',
		username: 'Player 2',
		x: 2,
		y: 2,
		fow: 5,
		hp: 10,
		movePoints: 10,
		currentMap: 'ashen_peaks',
		lastActive: Date.now(),
	},
	{
		id: 'player_uuid_3',
		username: 'Player 3',
		x: 3,
		y: 3,
		fow: 5,
		hp: 10,
		movePoints: 10,
		currentMap: 'ashen_peaks',
		lastActive: Date.now(),
	}
];

export default async function seedPlayers() {
	try {
		await mongoose.connect(process.env.MONGO_URI);

		for (const playerData of players) {
			const exists = await Player.findOne({ id: playerData.id });
			if (!exists) {
				await Player.create(playerData);
				console.log(`✅ Inserted: ${playerData.username}`);
			} else {
				console.log(`⚠️ Skipped existing: ${playerData.username}`);
			}
		}

		console.log('🎉 Player seeding complete!');
	} catch (err) {
		console.error('❌ Error seeding players:', err);
	}
}

