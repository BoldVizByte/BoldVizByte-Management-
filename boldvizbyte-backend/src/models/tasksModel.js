// src/models/tasksModel.js
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  assigneeId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  dueDate: { type: Date },
  status: { type: String, default: "todo" },
  priority: { type: String, default: "medium" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Task = mongoose.model("Task", taskSchema);

// --------------------------
// Functions (MongoDB versions)
// --------------------------

export async function createTask({ title, description, projectId, assigneeId, dueDate, status, priority }) {
  const task = await Task.create({
    title,
    description,
    projectId,
    assigneeId,
    dueDate,
    status: status || "todo",
    priority: priority || "medium"
  });
  return task.toObject();
}

export function allTasks() {
  return Task.find().lean();
}

export function findTaskById(id) {
  return Task.findById(id).lean();
}

export async function updateTask(id, payload) {
  payload.updatedAt = new Date();
  return Task.findByIdAndUpdate(id, payload, { new: true }).lean();
}

export function deleteTask(id) {
  return Task.findByIdAndDelete(id);
}

// default export for seed.js
export default Task;
