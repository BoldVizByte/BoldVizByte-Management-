import { createUser } from "../src/models/usersModel.js";
import { createProject } from "../src/models/projectsModel.js";
import { createTask } from "../src/models/tasksModel.js";
import { createAttendance } from "../src/models/attendanceModel.js";

console.log("Seeding in-memory data...");

// Seed Users
const user1 = createUser({
  name: "Admin User",
  email: "admin@example.com",
  password: "admin123",
  role: "admin"
});

const user2 = createUser({
  name: "Test User",
  email: "test@example.com",
  password: "test123",
  role: "user"
});

// Seed Projects
const project1 = createProject({
  title: "BoldVizByte Dashboard",
  description: "Dashboard development project",
  ownerId: user1.id,
  startDate: "2025-01-01",
  endDate: "2025-02-01"
});

// Seed Tasks
createTask({
  title: "Frontend Setup",
  description: "Initialize React project",
  projectId: project1.id,
  assigneeId: user2.id,
  dueDate: "2025-01-05",
  status: "todo",
  priority: "high"
});

// Seed Attendance
createAttendance({
  userId: user2.id,
  date: "2025-01-03",
  status: "present"
});

console.log("✔ In-memory database seeded successfully!");
console.log("Users:", user1, user2);
