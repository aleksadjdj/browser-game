// src/routes/entityRoutes.js
import express from "express";
import { interactEntityController } from "../controllers/entityController.js";

const router = express.Router();

// ✅ simpler route — same as frontend
router.post("/:id/interact-entity", interactEntityController);

export default router;