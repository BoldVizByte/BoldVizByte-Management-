import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.js";
import tasksRoutes from "./routes/tasks.js";
import projectsRoutes from "./routes/projects.js";
import attendanceRoutes from "./routes/attendance.js";
import summaryRoute from "./routes/summary.js";

const app = express();

app.use(cors());
app.use(express.json());

// 🔴 THIS LINE IS CRITICAL
app.use("/api/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/tasks", tasksRoutes);
app.use("/projects", projectsRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/api", summaryRoute);

app.get("/", (req, res) => {
  res.send("BoldVizByte Backend API Running");
});

export default app;
