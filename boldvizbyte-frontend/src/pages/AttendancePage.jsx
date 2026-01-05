import React, { useEffect, useState } from "react";

const API_BASE = "https://boldvizbyte-backend-1.onrender.com";

const AttendancePage = () => {
  const [users, setUsers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [saving, setSaving] = useState(false);

  // 🆕 Calendar state
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarEvents, setCalendarEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventText, setEventText] = useState("");
  const [eventType, setEventType] = useState("holiday");
  const [calendarAttendance, setCalendarAttendance] = useState({});


  useEffect(() => {
    fetch(`${API_BASE}/api/users`)
      .then((res) => res.json())
      .then((data) => {
        const userList = data?.data || [];
        setUsers(userList);

        const initial = {};
        userList.forEach((u) => {
          initial[u._id] = { status: "--", login: "--", logout: "--" };
        });
        setAttendance(initial);
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  useEffect(() => {
    if (!users.length) return;

    fetch(`${API_BASE}/api/attendance?date=${date}`)
      .then((res) => res.json())
      .then((res) => {
        const map = {};
        users.forEach((u) => {
          map[u._id] = { status: "--", login: "--", logout: "--" };
        });

        (res.data || []).forEach((r) => {
          map[r.userId._id || r.userId] = {
            status: r.status,
            login: r.login,
            logout: r.logout,
          };
        });

        setAttendance(map);
      })
      .catch((err) => {
        console.error("Error fetching attendance:", err);
      });
  }, [date, users]);

  const getTime = () =>
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const markPresent = (userId) => {
    setAttendance((prev) => ({
      ...prev,
      [userId]: { status: "Present", login: getTime(), logout: "--" },
    }));
  };

  const markAbsent = (userId) => {
    setAttendance((prev) => ({
      ...prev,
      [userId]: { status: "Absent", login: "--", logout: "--" },
    }));
  };

  const markAllPresent = () => {
    if (!window.confirm("Mark all users as Present?")) return;

    const updated = {};
    users.forEach((u) => {
      updated[u._id] = {
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
        userId: user._id,
        date,
        ...attendance[user._id],
      }));

      const res = await fetch(
        `${API_BASE}/api/attendance`,
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

  // 🆕 Calendar Functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const handleDateClick = (day) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setEventText(calendarEvents[dateStr]?.text || "");
    setEventType(calendarEvents[dateStr]?.type || "holiday");
    setDate(dateStr);
    setShowCalendar(false);

  };

  const saveEvent = () => {
    if (selectedDate && eventText.trim()) {
      setCalendarEvents(prev => ({
        ...prev,
        [selectedDate]: { text: eventText, type: eventType }
      }));
      setEventText("");
      setSelectedDate(null);
      alert("Event saved!");
    }
  };

  const deleteEvent = () => {
    if (selectedDate) {
      setCalendarEvents(prev => {
        const newEvents = { ...prev };
        delete newEvents[selectedDate];
        return newEvents;
      });
      setEventText("");
      setSelectedDate(null);
      alert("Event deleted!");
    }
  };

  const changeMonth = (direction) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const presentCount = Object.values(attendance).filter(
    (a) => a.status === "Present"
  ).length;

  const absentCount = Object.values(attendance).filter(
    (a) => a.status === "Absent"
  ).length;

  const getDayAttendanceStatus = (dateStr) => {
    const day = calendarAttendance[dateStr];
    if (!day) return null;

    if (day.present && !day.absent) return "present";
    if (day.absent && !day.present) return "absent";
    if (day.present && day.absent) return "mixed";
    return null;
  };


  useEffect(() => {
    const monthStr = `${currentMonth.getFullYear()}-${String(
      currentMonth.getMonth() + 1
    ).padStart(2, "0")}`;

    fetch(`${API_BASE}/api/attendance/monthly-summary?month=${monthStr}`)
      .then(res => res.json())
      .then(res => {
        const map = {};
        (res.data || []).forEach(d => {
          map[d._id] = d;
        });
        setCalendarAttendance(map);
      });
  }, [currentMonth]);


  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  if (showCalendar) {
    return (
      <div style={styles.calendarFullscreen}>
        <button style={styles.calendarCancelBtn} onClick={() => setShowCalendar(false)}>
          ✕ Close Calendar
        </button>

        <div style={styles.calendarWrapper}>
          <div style={styles.calendarContainer}>
            <div style={styles.calendarHeader}>
              <button style={styles.monthBtn} onClick={() => changeMonth(-1)}>‹</button>
              <h2 style={styles.monthTitle}>{monthNames[month]} {year}</h2>
              <button style={styles.monthBtn} onClick={() => changeMonth(1)}>›</button>
            </div>

            <div style={styles.calendarGrid}>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} style={styles.dayHeader}>{day}</div>
              ))}

              {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} style={styles.emptyDay}></div>
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const event = calendarEvents[dateStr];
                const isSelected = selectedDate === dateStr;
                const dayStatus = getDayAttendanceStatus(dateStr);

                return (
                  <div
                    key={day}
                    style={{
                      ...styles.calendarDay,
                      ...(event?.type === 'holiday' ? styles.holidayDay : {}),
                      ...(event?.type === 'deadline' ? styles.deadlineDay : {}),
                      ...(dayStatus === "present" && styles.calendarPresent),
                      ...(dayStatus === "absent" && styles.calendarAbsent),
                      ...(dayStatus === "mixed" && styles.calendarMixed),
                      ...(isSelected ? styles.selectedDay : {})
                    }}
                    onClick={() => handleDateClick(day)}
                  >
                    <div style={styles.dayNumber}>{day}</div>
                    {event && (
                      <div style={styles.eventLabel}>
                        {event.type === 'holiday' ? '🎉' : '⚠️'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {selectedDate && (
              <div style={styles.eventPanel}>
                <h3 style={styles.eventPanelTitle}>Event for {selectedDate}</h3>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  style={styles.eventTypeSelect}
                >
                  <option value="holiday">Holiday 🎉</option>
                  <option value="deadline">Deadline ⚠️</option>
                </select>
                <textarea
                  value={eventText}
                  onChange={(e) => setEventText(e.target.value)}
                  placeholder="Enter event details..."
                  style={styles.eventTextarea}
                />
                <div style={styles.eventButtons}>
                  <button style={styles.saveEventBtn} onClick={saveEvent}>
                    Save Event
                  </button>
                  <button style={styles.deleteEventBtn} onClick={deleteEvent}>
                    Delete Event
                  </button>
                  <button style={styles.cancelEventBtn} onClick={() => setSelectedDate(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div style={styles.legend}>
              <div style={styles.legendItem}>
                <span style={styles.legendHoliday}>🎉</span> Holiday
              </div>
              <div style={styles.legendItem}>
                <span style={styles.legendDeadline}>⚠️</span> Deadline
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.attendanceContainer}>
      <div style={styles.attendanceCard}>
        <h1 style={styles.attendanceTitle}>Attendance</h1>

        <div style={styles.attendanceSummaryRow}>
          <div style={styles.attendanceSummary}>
            <div style={{ ...styles.summaryCard, ...styles.presentCard }}>
              <h2>{presentCount}</h2>
              <p>Present</p>
            </div>
            <div style={{ ...styles.summaryCard, ...styles.absentCard }}>
              <h2>{absentCount}</h2>
              <p>Absent</p>
            </div>
          </div>

          <div style={styles.attendanceControls}>
            <div style={styles.attendanceDate}>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={styles.datePicker}
              />
            </div>
            <button style={styles.calendarBtn} onClick={() => setShowCalendar(true)}>
              📅 Calendar
            </button>
            <button style={styles.markAllBtn} onClick={markAllPresent}>
              Mark All Present
            </button>
            <button
              style={styles.saveAttendanceBtn}
              onClick={saveAttendance}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Attendance"}
            </button>
          </div>
        </div>

        <table style={styles.attendanceTable}>
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
            {users.map((u, i) => {
              const record = attendance[u._id] || {
                status: "--",
                login: "--",
                logout: "--",
              };

              return (
                <tr key={u._id}>
                  <td>{i + 1}</td>
                  <td>{u.name}</td>
                  <td>{record.login}</td>
                  <td>{record.logout}</td>
                  <td
                    style={
                      record.status === "Present"
                        ? styles.statusPresent
                        : record.status === "Absent"
                          ? styles.statusAbsent
                          : {}
                    }
                  >
                    {record.status}
                  </td>
                  <td>
                    <button style={styles.presentBtn} onClick={() => markPresent(u._id)}>Present</button>
                    <button style={styles.absentBtn} onClick={() => markAbsent(u._id)}>Absent</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  attendanceContainer: {
    minHeight: "100vh",
    padding: "40px",
    backgroundImage: "url(/images/dashboard-bg.jpg)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },

  attendanceCard: {
    width: "100%",
    maxWidth: "1200px",
    padding: "25px",
    borderRadius: "16px",
    minHeight: "380px",
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.2), rgba(255,255,255,0.2)), url(/images/dashboard-bg.jpg)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
  },

  attendanceTitle: {
    textAlign: "center",
    marginBottom: "20px",
    color: "black",
  },
  attendanceSummaryRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    width: "100%",
  },
  attendanceSummary: {
    display: "flex",
    gap: "10px",
  },
  summaryCard: {
    padding: "2px",
    width: "80px",
    height: "100px",
    textAlign: "center",
    borderRadius: "12px",
    background: "rgba(0, 0, 0, 0.50)",
    boxShadow: "0 0 10px rgba(0,0,0,0.4)",
  },
  presentCard: {
    color: "#4caf50",
  },
  absentCard: {
    color: "#f44336",
  },
  attendanceControls: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  attendanceDate: {
    marginRight: "10px",
  },
  datePicker: {
    padding: "6px 10px",
    borderRadius: "6px",
    border: "none",
    outline: "none",
    fontSize: "14px",
    color: "white",
    background: "rgba(0, 0, 0, 0.30)",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
  },
  calendarBtn: {
    background: "#9c27b0",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
  },
  markAllBtn: {
    backgroundColor: "#2196f3",
    color: "white",
    padding: "8px 14px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  saveAttendanceBtn: {
    backgroundColor: "#5aed5e",
    color: "white",
    padding: "8px 14px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  attendanceTable: {
    width: "100%",
    borderCollapse: "collapse",
    background: "rgba(0, 0, 0, 0.45)",
    borderRadius: "12px",
    overflow: "hidden",
    color: "white",
  },
  statusPresent: {
    color: "#4caf50",
    fontWeight: "bold",
  },
  statusAbsent: {
    color: "#f44336",
    fontWeight: "bold",
  },
  presentBtn: {
    padding: "6px 12px",
    marginRight: "5px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    backgroundColor: "#4caf50",
    color: "white",
  },
  absentBtn: {
    padding: "6px 12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    backgroundColor: "#f44336",
    color: "white",
  },
  calendarFullscreen: {
    position: "fixed",
    inset: 0,
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    zIndex: 9999,
    padding: "20px",
    overflow: "auto",
  },
  calendarCancelBtn: {
    position: "absolute",
    top: "20px",
    left: "20px",
    background: "#ff3b3b",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  },
  calendarWrapper: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "60px",
  },
  calendarContainer: {
    background: "white",
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    maxWidth: "900px",
    width: "100%",
  },
  calendarHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  monthBtn: {
    background: "#667eea",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "20px",
    fontWeight: "bold",
  },
  monthTitle: {
    fontSize: "24px",
    color: "#333",
    margin: 0,
  },
  calendarGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "10px",
    marginBottom: "20px",
  },
  dayHeader: {
    textAlign: "center",
    fontWeight: "bold",
    padding: "10px",
    color: "#667eea",
    fontSize: "14px",
  },
  emptyDay: {
    padding: "20px",
  },
  calendarDay: {
    padding: "15px",
    textAlign: "center",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    cursor: "pointer",
    minHeight: "60px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
    background: "white",
  },
  holidayDay: {
    background: "#fff3e0",
    borderColor: "#ff9800",
  },
  deadlineDay: {
    background: "#ffebee",
    borderColor: "#f44336",
  },
  selectedDay: {
    background: "#667eea",
    color: "white",
    borderColor: "#667eea",
    transform: "scale(1.05)",
  },
  dayNumber: {
    fontSize: "16px",
    fontWeight: "bold",
  },
  eventLabel: {
    fontSize: "20px",
    marginTop: "5px",
  },
  eventPanel: {
    background: "#f5f5f5",
    padding: "20px",
    borderRadius: "12px",
    marginTop: "20px",
  },
  eventPanelTitle: {
    marginTop: 0,
    marginBottom: "15px",
    color: "#333",
  },
  eventTypeSelect: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "2px solid #ddd",
    marginBottom: "10px",
    fontSize: "14px",
  },
  eventTextarea: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "2px solid #ddd",
    minHeight: "80px",
    fontSize: "14px",
    marginBottom: "10px",
    resize: "vertical",
  },
  eventButtons: {
    display: "flex",
    gap: "10px",
  },
  saveEventBtn: {
    flex: 1,
    padding: "10px",
    background: "#4caf50",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  deleteEventBtn: {
    flex: 1,
    padding: "10px",
    background: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  cancelEventBtn: {
    flex: 1,
    padding: "10px",
    background: "#9e9e9e",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  calendarPresent: {
    background: "#e8f5e9",
    borderColor: "#4caf50",
  },
  calendarAbsent: {
    background: "#ffebee",
    borderColor: "#f44336",
  },
  calendarMixed: {
    background: "#fffde7",
    borderColor: "#ff9800",
  },

  legend: {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
    marginTop: "20px",
    padding: "15px",
    background: "#f5f5f5",
    borderRadius: "8px",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#333",
  },
  legendHoliday: {
    fontSize: "20px",
  },
  legendDeadline: {
    fontSize: "20px",
  },
};

export default AttendancePage;