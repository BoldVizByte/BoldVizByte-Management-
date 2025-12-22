import express from "express";
import {
  getTasks,
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/tasksController.js";

const router = express.Router();

router.get("/", getTasks);       
router.get("/all", getAllTasks);  
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
