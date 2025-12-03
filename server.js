import express from "express";
import path from "path";
import dotenv from 'dotenv';

import connectDB from "./src/config/db/db.js";
import playerRoutes from "./src/routes/playerRoutes.js";
import entityRoutes from "./src/routes/entityRoutes.js";
import mapEditorRoutes from "./src/routes/mapEditorRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

// ✅ Parse JSON body
app.use(express.json()); 

// Connect to DB
await connectDB();

// Serve public folder (images, css, js)
app.use(express.static("public")); 



// ✅ Mount routes
app.use('/api/editor', mapEditorRoutes);
app.use('/api/player', playerRoutes);
app.use('/api/entity', entityRoutes);



// ✅ Serve Editor Page (frontend)
app.get("/editor", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "editor", "index.html"));
});

// ✅ Serve main.html by default when visiting /
app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "game", "index.html"));
});



// ✅ Start server
app.listen(PORT, () => {
  console.log(`🧩 Editor available at: http://localhost:${PORT}/editor`);
  console.log(`🎮 Player 1 available at http://localhost:${PORT}/?id=player_uuid_1`);
  console.log(`🎮 Player 2 available at http://localhost:${PORT}/?id=player_uuid_2`);
  console.log(`🎮 Player 3 available at http://localhost:${PORT}/?id=player_uuid_3`);
  console.log(`🎮 Game available at (player 1) http://localhost:${PORT}`);
  console.log(`✅ Server running at http://localhost:${PORT}`);
});