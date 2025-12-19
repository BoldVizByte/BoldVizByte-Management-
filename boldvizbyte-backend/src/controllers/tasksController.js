export function createTask(req, res) {
  res.json({ message: "Task created", data: req.body });
}

export function getAllTasks(req, res) {
  res.json({ message: "All tasks", data: [] });
}

export function getTaskById(req, res) {
  res.json({ message: `Task ${req.params.id}`, data: null });
}

export function updateTask(req, res) {
  res.json({ message: `Task ${req.params.id} updated`, data: req.body });
}

export function deleteTask(req, res) {
  res.json({ message: `Task ${req.params.id} deleted` });
}
