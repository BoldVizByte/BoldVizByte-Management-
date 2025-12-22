import express from "express";
import {
  getProjects,
  createProject,
  deleteProject,
  toggleProjectStatus,
} from "../controllers/projectsController.js";

const router = express.Router();

router.get("/", getProjects);
router.post("/", createProject);
router.delete("/:id", deleteProject);
router.patch("/:id/status", toggleProjectStatus);

export default router;
