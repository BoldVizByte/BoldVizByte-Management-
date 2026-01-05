import User from "../models/usersModel.js";
import Task from "../models/tasksModel.js";
import Project from "../models/projectsModel.js";
import Attendance from "../models/attendanceModel.js";

export const getSummary = async (req, res) => {
  try {
    const { date } = req.query; // 🆕 read date from query

    // USERS
    const totalUsers = await User.countDocuments();
    const newUsersThisWeek = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    // TASKS
    const pendingTasks = await Task.countDocuments({
      status: "Pending",
    });

    const completedTasks = await Task.countDocuments({
      status: "Completed",
    });

    // ATTENDANCE (selected date or today)
    const today = new Date().toISOString().split("T")[0];

    const present = await Attendance.countDocuments({
      date: today,
      status: "Present",
    });

    const absent = await Attendance.countDocuments({
      date: today,
      status: "Absent",
    });

    // PROJECTS
    const totalProjects = await Project.countDocuments();

    const runningProjects = await Project.countDocuments({
      status: "In Progress",
    });

    const completedProjects = await Project.countDocuments({
      status: "Completed",
    });


    res.status(200).json({
      users: {
        total: totalUsers,
        newThisWeek: newUsersThisWeek
      },
      tasks: {
        completed: completedTasks,
        pending: pendingTasks
      },
      attendance: {
        present,
        absent
      },
      projects: {
        total: totalProjects,
        running: runningProjects,
        completed: completedProjects
      },
      date: targetDate.toISOString().split("T")[0] // 🆕 return the date
    });
  } catch (err) {
    console.error("Dashboard summary error:", err);
    res.status(500).json({
      message: "Error fetching dashboard summary"
    });
  }
};
