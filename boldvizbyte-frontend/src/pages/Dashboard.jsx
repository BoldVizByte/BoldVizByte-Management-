import React, { useEffect, useState } from "react";
import axios from "axios";
import TopNavbar from "../components/TopNavbar";
import "../styles/dashboard.css";

const API_BASE = "https://boldvizbyte-management.onrender.com";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/summary`);
      setDashboardData(res.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <p style={{ padding: "20px", color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <TopNavbar />
      <div className="dashboard-container">
        <div className="dashboard-main">
          <div className="cards-container">
            <div className="top-cards">
              <div className="card big-card">
                <h2>Users Overview</h2>
                <p>Total Users: {dashboardData?.users?.total ?? 0}</p>
                <p>New This Week: {dashboardData?.users?.newThisWeek ?? 0}</p>
              </div>

              <div className="card big-card">
                <h2>Tasks Overview</h2>
                <p>Pending Tasks: {dashboardData?.tasks?.pending ?? 0}</p>
                <p>Completed: {dashboardData?.tasks?.completed ?? 0}</p>
              </div>
            </div>

            <div className="bottom-cards">
              <div className="card small-card">
                <h3>Attendance Today</h3>
                <p>Present: {dashboardData?.attendance?.present ?? 0}</p>
                <p>Absent: {dashboardData?.attendance?.absent ?? 0}</p>
              </div>

              <div className="card small-card">
                <h3>Projects Active</h3>
                <p>Total: {dashboardData?.projects?.total ?? 0}</p>
                <p>Running: {dashboardData?.projects?.running ?? 0}</p>
                <p>Completed: {dashboardData?.projects?.completed ?? 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
