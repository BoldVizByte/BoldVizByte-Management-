import Project from "../models/projectsModel.js";

/**
 * GET all projects
 */
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * CREATE project
 */
export const createProject = async (req, res) => {
  try {
    const { title, start, end, status } = req.body;

    if (!title || !start || !end) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const project = await Project.create({
      title,
      start,
      end,
      status,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE project
 */
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * TOGGLE project status
 */
export const toggleProjectStatus = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    project.status =
      project.status === "In Progress" ? "Completed" : "In Progress";

    await project.save();
    res.json(project);
  } catch (err) {
    res.status(404).json({ message: "Project not found" });
  }
};
