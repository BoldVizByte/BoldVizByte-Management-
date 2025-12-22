import { useEffect, useState } from "react";
import "../styles/tasks.css";

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [projectId, setProjectId] = useState(""); 

  // Change this to match your environment
  const API_URL = "http://localhost:5000/api";
  // const API_URL = "https://boldvizbyte-backend-1.onrender.com";

  useEffect(() => {
    fetch(`${API_URL}/users`)
      .then(res => res.json())
      .then(data => {
      
        const userList = Array.isArray(data) ? data : data.data || data.users || [];
        setUsers(userList);
      })
      .catch(() => setError("Failed to load users"));

    fetch(`${API_URL}/projects`)
      .then(res => res.json())
      .then(data => {
        const projectList = Array.isArray(data) ? data : data.data || data.projects || [];
        setProjects(projectList);
      })
      .catch(() => console.log("No projects endpoint available"));

    fetch(`${API_URL}/tasks`)
      .then(res => res.json())
      .then(data => {
        const taskList = Array.isArray(data) ? data : data.tasks || [];
        setTasks(taskList);
      })
      .catch(() => setError("Failed to load tasks"));
  }, []);

  const addTask = async () => {
    setError("");

    if (!title || !assignedTo || ! projectId) {
      setError("Please fill in all required fields");
      return;
    }

  
    const taskData = {
      title,
      assignedTo,
      projectId
    };
    
    // if (projectId) {
    //   taskData.projectId = projectId;
    // }

    console.log("Creating task with:", taskData);

    try {
      setLoading(true);

      const res = await fetch(
        `${API_URL}/tasks`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(taskData),
        }
      );

      console.log("Response status:", res.status);

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error response:", errorData);
        
       
        let errorMsg = "Failed to create task";
        if (errorData.error) {
          errorMsg = errorData.error;
          if (errorData.details) {
            errorMsg += ": " + JSON.stringify(errorData.details);
          }
        } else if (errorData.message) {
          errorMsg = errorData.message;
        }
        
        throw new Error(errorMsg);
      }

      const newTask = await res.json();
      console.log("New task created:", newTask);
      setTasks(prev => [...prev, newTask]);
      setTitle("");
      setAssignedTo("");
      setProjectId("");
    } catch (err) {
      console.error("Error creating task:", err);
      setError(err.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id) => {
    try {
      const res = await fetch(
        `${API_URL}/tasks/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Completed" }),
        }
      );

      if (!res.ok) throw new Error();

      const updated = await res.json();
      setTasks(prev => prev.map(t => (t._id === id ? updated : t)));
    } catch {
      setError("Failed to update task");
    }
  };

  const deleteTask = async (id) => {
    try {
      const res = await fetch(
        `${API_URL}/tasks/${id}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error();

      setTasks(prev => prev.filter(t => t._id !== id));
    } catch {
      setError("Failed to delete task");
    }
  };

  return (
    <div className="tasks-page-container">
      <div className="tasks-card">
        <h1>Tasks</h1>

        {error && <p className="task-error">{error}</p>}

        <div className="task-form">
          <input
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          >
            <option value="">Assign to</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name || u.email}
              </option>
            ))}
          </select>

          {projects.length > 0 && (
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            >
              <option value="">Select project</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name || p.title}
                </option>
              ))}
            </select>
          )}

          <button onClick={addTask} disabled={loading}>
            {loading ? "Adding..." : "Add Task"}
          </button>
        </div>

        <table className="tasks-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Project</th>
              <th>Assigned To</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", height: "120px" }}>
                  No tasks found
                </td>
              </tr>
            ) : (
              tasks.map(task => (
                <tr key={task._id}>
                  <td>{task.title}</td>
                  <td>{task.projectId}</td>
                  <td>{task.assignedTo?.email || "Unassigned"}</td>
                  <td>{task.status}</td>
                  <td>
                    <button
                      disabled={task.status === "Completed"}
                      onClick={() => updateStatus(task._id)}
                    >
                      ✔
                    </button>
                    <button onClick={() => deleteTask(task._id)}>❌</button>
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

export default TaskPage;