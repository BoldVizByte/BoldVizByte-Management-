import express from "express";
import User from "../models/usersModel.js";
import Task from "../models/tasksModel.js";
import Attendance from "../models/attendanceModel.js";
import Project from "../models/projectsModel.js";
import { getSummary } from "../controllers/summaryController.js";

const router = express.Router();

router.get("/summary", async (req, res) => {
  try {
    // Calculate one week ago date for new users
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Users data
    const usersTotal = await User.countDocuments();
    const usersNewThisWeek = await User.countDocuments({ createdAt: { $gte: oneWeekAgo } });

    // Tasks data
    const tasksCompleted = await Task.countDocuments({ status: "completed" });
    const tasksPending = await Task.countDocuments({ status: "pending" });

    // Attendance data
    const attendancePresent = await Attendance.countDocuments({ status: "present" });
    const attendanceAbsent = await Attendance.countDocuments({ status: "absent" });

    // Projects data
    const projectsRunning = await Project.countDocuments({ status: "running" });
    const projectsCompleted = await Project.countDocuments({ status: "completed" });

    // Send aggregated data as JSON
    res.json({
      users: { total: usersTotal, newThisWeek: usersNewThisWeek },
      tasks: { completed: tasksCompleted, pending: tasksPending },
      attendance: { present: attendancePresent, absent: attendanceAbsent },
      projects: { running: projectsRunning, completed: projectsCompleted },
    });
  } catch (error) {
    console.error("Error fetching summary:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
