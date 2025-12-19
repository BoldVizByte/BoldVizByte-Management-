import React, { useState } from "react";
import "../styles/tasks.css";
import { getTasks,addTask,deleteTask,updateTaskStatus } from "../apiService";



const TasksPage = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Design landing page", status: "To Do" },
    { id: 2, title: "Fix login bug", status: "In Progress" },
    { id: 3, title: "Deploy backend", status: "Done" },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState("To Do");

  const handleAddTask = () => {
    if (newTaskTitle) {
      const newTask = {
        id: tasks.length + 1,
        title: newTaskTitle,
        status: newTaskStatus,
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle("");
    } else {
      alert("Enter task title");
    }
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const statuses = ["To Do", "In Progress", "Done"];

  return (
    <div className="tasks-page-container">
      <h1>Tasks Board</h1>

      {/* Add Task */}
      <div className="add-task-form">
        <input
          type="text"
          placeholder="Task Title"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <select
          value={newTaskStatus}
          onChange={(e) => setNewTaskStatus(e.target.value)}
        >
          {statuses.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <button onClick={handleAddTask}>Add Task</button>
      </div>

      {/* Task Columns */}
      <div className="tasks-columns">
        {statuses.map((status) => (
          <div key={status} className="tasks-column">
            <h3>{status}</h3>
            {tasks
              .filter((task) => task.status === status)
              .map((task) => (
                <div key={task.id} className="task-card">
                  <span>{task.title}</span>
                  <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksPage;
