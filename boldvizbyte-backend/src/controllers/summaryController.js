import User from "../models/usersModel.js";
import Task from "../models/tasksModel.js";
import Project from "../models/projectsModel.js";
import Attendance from "../models/attendanceModel.js";

export const getSummary = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const newUsersThisWeek = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7*24*60*60*1000) } // last 7 days
    });

    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: "completed" });
    const pendingTasks = totalTasks - completedTasks;

    const attendanceRecords = await Attendance.find({ date: new Date().toISOString().slice(0,10) });
    const present = attendanceRecords.filter(r => r.status === "present").length;
    const absent = attendanceRecords.filter(r => r.status === "absent").length;

    const totalProjects = await Project.countDocuments();
    const completedProjects = await Project.countDocuments({ status: "completed" });
    const runningProjects = totalProjects - completedProjects;

    res.json({
      users: { total: totalUsers, newThisWeek: newUsersThisWeek },
      tasks: { completed: completedTasks, pending: pendingTasks },
      attendance: { present, absent },
      projects: { running: runningProjects, completed: completedProjects }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching summary", error: err.message });
  }
};
