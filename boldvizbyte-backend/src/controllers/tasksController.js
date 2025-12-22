import Task from "../models/tasksModel.js";

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: { $ne: null } })
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch all tasks" });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, assignedTo, description } = req.body;

    if (!title || !assignedTo) {
      return res.status(400).json({
        message: "Title and assignedTo are required",
      });
    }

    const task = await Task.create({
      title,
      description: description || "",
      assignedTo,
    });

    const populatedTask = await task.populate(
      "assignedTo",
      "name email"
    );

    res.status(201).json(populatedTask);
  } catch (error) {
    console.error("CREATE TASK ERROR:", error);
    res.status(500).json({ message: "Failed to create task" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await Task.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("assignedTo", "name email");

    if (!updated) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update task" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Task.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task" });
  }
};
