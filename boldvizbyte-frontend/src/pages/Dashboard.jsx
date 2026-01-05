import React, { useEffect, useState } from "react";
import axios from "axios";
import TopNavbar from "../components/TopNavbar";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/summary");
      setDashboardData(res.data);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading dashboard...</p>;
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
                <p>Total Users: {dashboardData?.users?.total}</p>
                <p>New This Week: {dashboardData?.users?.newThisWeek}</p>
              </div>

              <div className="card big-card">
                <h2>Tasks Overview</h2>
                <p>Pending Tasks: {dashboardData?.tasks?.pending}</p>
                <p>Completed: {dashboardData?.tasks?.completed}</p>
              </div>
            </div>

            <div className="bottom-cards">
              <div className="card small-card">
                <h3>Attendance Today</h3>
                <p>Present: {dashboardData?.attendance?.present}</p>
                <p>Absent: {dashboardData?.attendance?.absent}</p>
              </div>

              <div className="card small-card">
                <h3>Projects Active</h3>
                <p>Total: {dashboardData?.projects?.total}</p>
                <p>Running: {dashboardData?.projects?.running}</p>
                <p>Completed: {dashboardData?.projects?.completed}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
