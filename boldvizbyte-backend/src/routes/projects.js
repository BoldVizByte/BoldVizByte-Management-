import express from "express";
import {
  getProjects,
  createProject,
  deleteProject,
  toggleProjectStatus,
} from "../controllers/project.controller.js";

const router = express.Router();

router.get("/", getProjects);
router.post("/", createProject);
router.delete("/:id", deleteProject);
// ✅ support BOTH methods
router.put("/:id", toggleProjectStatus);
router.patch("/:id/status", toggleProjectStatus);




export default router;
