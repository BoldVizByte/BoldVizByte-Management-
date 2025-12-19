import API from "./api/api.js"; // your backend API instance

// Users
export const getUsers = () => API.get("/users");
export const addUser = (user) => API.post("/users", user);
export const deleteUser = (id) => API.delete(`/users/${id}`);

// Tasks
export const getTasks = () => API.get("/tasks");
export const addTask = (task) => API.post("/tasks", task);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
export const updateTaskStatus = (id, status) =>
  API.put(`/tasks/${id}`, { status });

// Projects
export const getProjects = () => API.get("/projects");
export const addProject = (project) => API.post("/projects", project);
export const deleteProject = (id) => API.delete(`/projects/${id}`);
export const updateProjectStatus = (id, status) =>
  API.put(`/projects/${id}`, { status });

// Attendance
export const getAttendance = () => API.get("/attendance");
export const markAttendance = (userId, status) =>
  API.post("/attendance", { userId, status });
