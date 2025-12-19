import React from "react";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import "../styles/dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container"> 
      {/* Main content */}
      <div className="dashboard-main">
        <TopNavbar />

        <div className="cards-container">
          <div className="top-cards">
            <div className="card big-card">
              <h2>Users Overview</h2>
              <p>Total Users: 4</p>
              <p>New This Week: 2</p>
            </div>
            <div className="card big-card">
              <h2>Tasks Overview</h2>
              <p>Pending Tasks: 2</p>
              <p>Completed: 10</p>
            </div>
          </div>

          <div className="bottom-cards">
            <div className="card small-card">
              <h3>Attendance Today</h3>
              <p>Present: 3</p>
              <p>Absent: 1</p>
            </div>
            <div className="card small-card">
              <h3>Projects Active</h3>
              <p>Running: 5</p>
              <p>Completed: 22</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;