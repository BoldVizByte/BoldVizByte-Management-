import express from "express";
import * as projectsController from "../controllers/projectsController.js";
import * as projectsValidator from "../validators/projectsValidator.js";

const router = express.Router();

// List all projects
router.get("/", projectsController.listProjects);

// Get project by ID
router.get("/:id", projectsValidator.idParamRule, projectsController.getProject);

// Create project
router.post("/", projectsValidator.createProjectRules, projectsController.createProject);

// Update project
router.put("/:id", projectsValidator.idParamRule, projectsValidator.updateProjectRules, projectsController.updateProject);

// Delete project
router.delete("/:id", projectsValidator.idParamRule, projectsController.removeProject);

export default router;
