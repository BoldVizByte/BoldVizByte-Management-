import React, { useState, useEffect } from "react";
import "../styles/projects.css";
import {
  getProjects,
  addProject,
  deleteProject,
  updateProjectStatus,
} from "../apiService";

const ProjectsPage = () => {
  // ✅ MongoDB projects
  const [projects, setProjects] = useState([]);

  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectStatus, setNewProjectStatus] = useState("In Progress");
  const [newProjectStartDate, setNewProjectStartDate] = useState("");
  const [newProjectEndDate, setNewProjectEndDate] = useState("");

  // 🔹 Fetch projects on page load
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects", error);
    }
  };

  // 🔹 Add project
  const handleAddProject = async () => {
    if (!newProjectTitle || !newProjectStartDate || !newProjectEndDate) {
      alert("All fields required");
      return;
    }

    const project = {
      title: newProjectTitle,
      start: newProjectStartDate,
      end: newProjectEndDate,
      status: newProjectStatus,
    };

    try {
      const { data } = await addProject(project);
      setProjects((prev) => [...prev, data]);

      // reset form
      setNewProjectTitle("");
      setNewProjectStartDate("");
      setNewProjectEndDate("");
      setNewProjectStatus("In Progress");
    } catch (error) {
      console.error("Add project failed", error);
    }
  };

  // 🔹 Delete project
  const handleDeleteProject = async (id) => {
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  // 🔹 Toggle project status
  const handleToggleStatus = async (id) => {
    try {
      const { data } = await updateProjectStatus(id);
      setProjects((prev) =>
        prev.map((p) => (p._id === id ? data : p))
      );
    } catch (error) {
      console.error("Status update failed", error);
    }
  };

  return (
    <div className="projects-page-container">
      <div className="projects-card">
        <h1>Projects Management</h1>

        {/* 🔹 Add Project Form */}
        <div className="add-project-form">
          <input
            className="add-project-input-title"
            type="text"
            placeholder="Project Title"
            value={newProjectTitle}
            onChange={(e) => setNewProjectTitle(e.target.value)}
          />

          <input
            type="date"
            value={newProjectStartDate}
            onChange={(e) => setNewProjectStartDate(e.target.value)}
          />

          <input
            type="date"
            value={newProjectEndDate}
            onChange={(e) => setNewProjectEndDate(e.target.value)}
          />

          <select
            value={newProjectStatus}
            onChange={(e) => setNewProjectStatus(e.target.value)}
          >
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <button onClick={handleAddProject}>Add Project</button>
        </div>

        {/* 🔹 Projects Table */}
        <table className="projects-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No projects found
                </td>
              </tr>
            ) : (
              projects.map((project, index) => (
                <tr key={project._id}>
                  <td>{index + 1}</td>
                  <td>{project.title}</td>
                  <td>
                    {new Date(project.start).toLocaleDateString()}
                  </td>
                  <td>
                    {new Date(project.end).toLocaleDateString()}
                  </td>
                  <td>{project.status}</td>
                  <td>
                    <button
                      onClick={() => handleToggleStatus(project._id)}
                    >
                      Toggle Status
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectsPage;
