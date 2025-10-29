import express from "express";
import path from "path";
import dotenv from 'dotenv';


import connectDB from "./src/config/db/db.js";
// ✅ import route
import playerRoutes from "./src/routes/playerRoutes.js";
import mapEditorRoutes from "./src/routes/mapEditorRoutes.js";

dotenv.config();


const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json()); // ✅ Parse JSON body

// Connect to DB
await connectDB();

// Serve public folder (images, css, js)
app.use(express.static("public")); 


// ✅ Mount routes
app.use('/api/player', playerRoutes);
app.use('/api/editor', mapEditorRoutes);



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
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`🧩 Editor available at: http://localhost:${PORT}/editor`);
});