import React, { useEffect, useState } from "react";
import "../styles/attendance.css";

const AttendancePage = () => {
  const [users, setUsers] = useState([]);
  const [attendance, setAttendance] = useState({});

  // 🆕 Date state
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  // 🆕 Loading state
  const [saving, setSaving] = useState(false);

  useEffect(() => {
  fetch("https://boldvizbyte-backend-1.onrender.com/users")
    .then((res) => res.json())
    .then((data) => {
      const userList = Array.isArray(data) ? data : data.users || [];
      setUsers(userList);

      const initialAttendance = {};
      userList.forEach((user) => {
        initialAttendance[user._id] = {
          status: "--",
          login: "--",
          logout: "--",
        };
      });
      setAttendance(initialAttendance);
    })
    .catch((err) => console.error("Error fetching users:", err));
}, []);


  const getTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

const markPresent = (userId) => {
    setAttendance((prev) => ({
      ...prev,
      [userId]: { status: "Present", login: getTime(), logout: "--" },
    }));
  };

  const markAbsent = (userId) => {
    setAttendance((prev) => ({
      ...prev,
      [userId]: { status: "Absent", login: "--", logout: getTime() },
    }));
  };

  const markAllPresent = () => {
  const updated = {};
  users.forEach((user) => {
    updated[user._id] = {
      status: "Present",
      login: getTime(),
      logout: "--",
    };
  });
  setAttendance(updated);
};


  const saveAttendance = async () => {
  setSaving(true);
  try {
    const records = users.map((user) => ({
      userId: user._id, // ✅ MongoDB ObjectId
      date,
      ...attendance[user._id],
    }));

    const res = await fetch(
      "https://boldvizbyte-backend-1.onrender.com/attendance",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ records }),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to save attendance");
    }

    alert("Attendance saved successfully");
  } catch (err) {
    console.error(err);
    alert("Failed to save attendance");
  } finally {
    setSaving(false);
  }
};


  const presentCount = Object.values(attendance).filter(
    (a) => a.status === "Present"
  ).length;

  const absentCount = Object.values(attendance).filter(
    (a) => a.status === "Absent"
  ).length;

  return (
    <div className="attendance-container">
      <h1 className="attendance-title">Attendance</h1>

      {/* 🆕 Summary + Controls Row */}
      <div className="attendance-summary-row">
        {/* Summary Cards */}
        <div className="attendance-summary">
          <div className="summary-card present-card">
            <h2>{presentCount}</h2>
            <p>Present</p>
          </div>
          <div className="summary-card absent-card">
            <h2>{absentCount}</h2>
            <p>Absent</p>
          </div>
        </div>

        {/* Controls */}
        <div className="attendance-controls">
          <label>Date: </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="date-picker"
          />
          <button className="mark-all-btn" onClick={markAllPresent}>
            Mark All Present
          </button>
          <button
            className="save-attendance-btn"
            onClick={saveAttendance}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Attendance"}
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="attendance-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Login</th>
            <th>Logout</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => {
  const record = attendance[user._id] || {
    status: "--",
    login: "--",
    logout: "--",
  };

  return (
    <tr key={user._id}>
      <td>{index + 1}</td>
      <td>{user.name}</td>
      <td>{record.login}</td>
      <td>{record.logout}</td>
      <td
        className={
          record.status === "Present"
            ? "status-present"
            : record.status === "Absent"
            ? "status-absent"
            : ""
        }
      >
        {record.status}
      </td>
      <td>
        <button onClick={() => markPresent(user._id)}>Present</button>
        <button onClick={() => markAbsent(user._id)}>Absent</button>
      </td>
    </tr>
  );
})}

        </tbody>
      </table>
    </div>
  );
};

export default AttendancePage;