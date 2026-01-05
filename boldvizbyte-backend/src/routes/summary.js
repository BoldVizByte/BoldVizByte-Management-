import express from "express";
import { getSummary } from "../controllers/summaryController.js";

const router = express.Router();

// Dashboard summary route (supports optional ?date=YYYY-MM-DD)
router.get("/summary", getSummary);

export default router;
