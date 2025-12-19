// src/models/projectsModel.js
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  startDate: { type: Date },
  endDate: { type: Date },
  status: { type: String, default: "planned" }, // planned, active, completed
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Project = mongoose.model("Project", projectSchema);

// --------------------------
// Functions (MongoDB versions)
// --------------------------

export async function createProject({ title, description, ownerId, startDate, endDate, status }) {
  const project = await Project.create({
    title,
    description,
    ownerId,
    startDate,
    endDate,
    status: status || "planned"
  });

  return project.toObject();
}

export function allProjects() {
  return Project.find().lean();
}

export function findProjectById(id) {
  return Project.findById(id).lean();
}

export async function updateProject(id, payload) {
  payload.updatedAt = new Date();
  return Project.findByIdAndUpdate(id, payload, { new: true }).lean();
}

export function deleteProject(id) {
  return Project.findByIdAndDelete(id);
}

// default export
export default Project;
