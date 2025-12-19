import express from "express";
import * as tasksController from "../controllers/tasksController.js";
import * as tasksValidator from "../validators/tasksValidator.js";

const router = express.Router();

// Create a new task
router.post("/", tasksValidator.createTaskRules, tasksController.createTask);

// Get all tasks
router.get("/", tasksController.getAllTasks);

// Get task by ID
router.get("/:id", tasksValidator.idParamRule, tasksController.getTaskById);

// Update task
router.put("/:id", tasksValidator.idParamRule, tasksValidator.updateTaskRules, tasksController.updateTask);

// Delete task
router.delete("/:id", tasksValidator.idParamRule, tasksController.deleteTask);

export default router;
