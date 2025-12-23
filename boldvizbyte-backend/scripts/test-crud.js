import {
  createUser,
  allUsers,
  findUserById,
  updateUser,
  deleteUser,
} from "../src/models/usersModel.js";

import {
  createProject,
  allProjects,
  findProjectById,
  updateProject,
  deleteProject,
} from "../src/models/projectsModel.js";

import {
  createTask,
  allTasks,
  findTaskById,
  updateTask,
  deleteTask,
} from "../src/models/tasksModel.js";

import {
  createAttendance,
  allAttendance,
  findAttendanceById,
  updateAttendance,
  deleteAttendance,
} from "../src/models/attendanceModel.js";

console.log("🧪 Running CRUD Tests...\n");

/* ---------------- USERS ---------------- */
console.log("➡️ Testing USER CRUD");

const user = createUser({
  name: "Test User",
  email: "test@example.com",
  role: "employee",
});
console.log("Created User:", user);

console.log("All Users:", allUsers());

console.log("Find User:", findUserById(user.id));

const updatedUser = updateUser(user.id, { name: "Updated User" });
console.log("Updated User:", updatedUser);

console.log("Delete User:", deleteUser(user.id));
console.log("All Users after delete:", allUsers(), "\n");

/* ---------------- PROJECTS ---------------- */
console.log("➡️ Testing PROJECT CRUD");

const project = createProject({
  title: "Test Project",
  description: "Project for testing",
  managerId: "1",
});
console.log("Created Project:", project);

console.log("All Projects:", allProjects());

console.log("Find Project:", findProjectById(project.id));

const updatedProject = updateProject(project.id, { title: "Updated Project" });
console.log("Updated Project:", updatedProject);

console.log("Delete Project:", deleteProject(project.id));
console.log("All Projects after delete:", allProjects(), "\n");

/* ---------------- TASKS ---------------- */
console.log("➡️ Testing TASK CRUD");

const task = createTask({
  title: "Test Task",
  description: "Task for testing",
  projectId: "1",
  assigneeId: "2",
  dueDate: "2025-12-31",
});
console.log("Created Task:", task);

console.log("All Tasks:", allTasks());

console.log("Find Task:", findTaskById(task.id));

const updatedTask = updateTask(task.id, { status: "done" });
console.log("Updated Task:", updatedTask);

console.log("Delete Task:", deleteTask(task.id));
console.log("All Tasks after delete:", allTasks(), "\n");

/* ---------------- ATTENDANCE ---------------- */
console.log("➡️ Testing ATTENDANCE CRUD");

const attendance = createAttendance({
  userId: "2",
  date: "2025-12-05",
  status: "present",
});
console.log("Created Attendance:", attendance);

console.log("All Attendance:", allAttendance());

console.log("Find Attendance:", findAttendanceById(attendance.id));

const updatedAttendance = updateAttendance(attendance.id, {
  status: "absent",
});
console.log("Updated Attendance:", updatedAttendance);

console.log("Delete Attendance:", deleteAttendance(attendance.id));
console.log("All Attendance after delete:", allAttendance(), "\n");

console.log("🎉 All CRUD tests completed!");
