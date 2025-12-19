export function listProjects(req, res) {
  res.json({ message: "All projects", data: [] });
}

export function getProject(req, res) {
  res.json({ message: `Project ${req.params.id}`, data: null });
}

export function createProject(req, res) {
  res.json({ message: "Project created", data: req.body });
}

export function updateProject(req, res) {
  res.json({ message: `Project ${req.params.id} updated`, data: req.body });
}

export function removeProject(req, res) {
  res.json({ message: `Project ${req.params.id} deleted` });
}
