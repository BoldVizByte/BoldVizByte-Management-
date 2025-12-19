import Attendance from "../models/attendanceModel.js";

// Save multiple attendance records
export async function createAttendance(req, res) {
  try {
    const { records } = req.body;

    if (!records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ message: "No attendance records provided" });
    }

    // Save each record
    const savedRecords = [];
    for (const record of records) {
      const { userId, date, status, login, logout } = record;

      // Basic validation
      if (!userId || !date || !status) continue;

      const attendance = new Attendance({
        userId,
        date,
        status,
        login: login || "--",
        logout: logout || "--",
      });

      const saved = await attendance.save();
      savedRecords.push(saved);
    }

    res.status(201).json({
      message: "Attendance recorded successfully",
      data: savedRecords,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// Get all attendance records
export async function getAllAttendance(req, res) {
  try {
    const allAttendance = await Attendance.find();
    res.json({ message: "All attendance records", data: allAttendance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// Get attendance by ID
export async function getAttendanceById(req, res) {
  try {
    const { id } = req.params;
    const record = await Attendance.findById(id);
    if (!record) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    res.json({ message: `Attendance ${id}`, data: record });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// Update attendance by ID
export async function updateAttendance(req, res) {
  try {
    const { id } = req.params;
    const updated = await Attendance.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    res.json({ message: `Attendance ${id} updated`, data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// Delete attendance by ID
export async function deleteAttendance(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Attendance.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    res.json({ message: `Attendance ${id} deleted` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}