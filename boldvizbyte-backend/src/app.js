import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.js";
import attendanceRoutes from "./routes/attendance.js";
import projectsRoutes from "./routes/projects.js";
import tasksRoutes from "./routes/tasks.js";
import summaryRoutes from "./routes/summary.js";



const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/summary", summaryRoutes);

app.get("/", (req, res) => {
  res.send("✅ BoldVizByte Backend API Running");
});

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.path,
  });
});

export default app;
