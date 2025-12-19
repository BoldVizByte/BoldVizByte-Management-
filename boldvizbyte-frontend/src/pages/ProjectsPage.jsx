import React, { useState } from "react";
import "../styles/projects.css";
import { getProjects,addProject,deleteProject,updateProjectStatus } from "../apiService";

const ProjectsPage = () => {
  // Each project has: id, title, status
  const [projects, setProjects] = useState([
    { id: 1, title: "HTML Basics", status: "In Progress" },
    { id: 2, title: "CSS Basics", status: "Completed" },
  ]);

  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectStatus, setNewProjectStatus] = useState("In Progress");

  // Add new project
  const handleAddProject = () => {
    if (!newProjectTitle) {
      alert("Please enter project title");
      return;
    }

    const newProject = {
      id: projects.length + 1,
      title: newProjectTitle,
      status: newProjectStatus,
    };
    setProjects([...projects, newProject]);
    setNewProjectTitle("");
  };

  // Delete project
  const handleDeleteProject = (id) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  // Change project status
  const handleToggleStatus = (id) => {
    setProjects(
      projects.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "In Progress" ? "Completed" : "In Progress" }
          : p
      )
    );
  };

  return (
    <div className="projects-page-container">
      <h1>Projects Management</h1>

      {/* Add Project Form */}
      <div className="add-project-form">
        <input
          type="text"
          placeholder="Project Title"
          value={newProjectTitle}
          onChange={(e) => setNewProjectTitle(e.target.value)}
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

      {/* Projects List */}
      <table className="projects-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td>{project.id}</td>
              <td>{project.title}</td>
              <td>{project.status}</td>
              <td>
                <button onClick={() => handleToggleStatus(project.id)}>
                  Toggle Status
                </button>
                <button onClick={() => handleDeleteProject(project.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default ProjectsPage;
