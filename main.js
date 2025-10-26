import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// ✅ import route
import mapEditorRoutes from "./src/routes/map_editor.js"; 
import playerRoutes from "./src/routes/player.js";


const app = express();
const PORT = process.env.PORT || 3000;


// ✅ Parse JSON body
app.use(express.json());

// Serve public folder (images, css, js)
app.use(express.static("public")); 

// Serve map editor files
app.use("/editor", express.static("map_editor"));

// ✅ Mount routes
app.use("/api/maps", mapEditorRoutes); // ✅ mount map routes


// Mount player routes
app.use("/api/player", playerRoutes);

// route for now
app.get("/main.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "main.html"));
});





app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);